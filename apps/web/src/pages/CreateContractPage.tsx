import { useState } from 'react';
import { createContract } from '../lib/hooks/use-create-contract';
import { runActionWithState, createActionState, getErrorMessage } from '../lib/api/run-action';
import { can, ContractAction } from '../lib/state/contract-states';
// import { get } from '../lib/api/api';

// interface ExistingContract { ... }

export function CreateContractPage({ onContractCreated }: { onContractCreated: (id: string) => void }) {
    const [threshold, setThreshold] = useState(10000);
    const [durationDays, setDurationDays] = useState(30);
    const [stakeUsd, setStakeUsd] = useState(100);
    const [state, setState] = useState(createActionState());
    // const [existingContracts, setExistingContracts] = useState<ExistingContract[]>([]);
    // const [loading, setLoading] = useState(true);



    const handleCreate = async () => {
        // Calculate deadline
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + durationDays);

        const params = {
            platform: 'X' as const,
            metricType: 'FOLLOWERS',
            condition: {
                operator: 'GTE' as const,
                threshold: Number(threshold),
                deadline: deadline.toISOString(),
            },
            lockAmountUsdCents: Number(stakeUsd) * 100,
            payoutAmountUsdCents: Number(stakeUsd) * 100, // Break even for demo
        };

        await runActionWithState(state, () => createContract(params, true), (response) => {
            console.log('[CreateContractPage] Response:', response);
            const data = (response as any).data || response;
            console.log('[CreateContractPage] Data:', data);
            if (data.contractId) {
                onContractCreated(data.contractId);
            } else if (data.contract?.id) {
                onContractCreated(data.contract.id);
            } else {
                console.error('[CreateContractPage] No contractId in response:', data);
            }
        });
        setState({ ...state });
    };

    // Derived check
    const isAllowed = can(ContractAction.CREATE_CONTRACT, null, { xVerified: true });

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create Contract</h1>

            {state.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {state.error.message || getErrorMessage(state.error.code)}
                </div>
            )}

            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium mb-1">Platform</label>
                    <input type="text" value="X (Twitter)" disabled className="w-full p-2 border bg-gray-100 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Target Followers</label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={e => setThreshold(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Duration (Days)</label>
                    <input
                        type="number"
                        value={durationDays}
                        onChange={e => setDurationDays(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Stake (USD)</label>
                    <input
                        type="number"
                        value={stakeUsd}
                        onChange={e => setStakeUsd(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <button
                onClick={handleCreate}
                disabled={state.loading || !isAllowed}
                className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
                {state.loading ? 'Creating...' : 'Create Contract'}
            </button>

            {!isAllowed && (
                <p className="mt-2 text-sm text-red-600">
                    Cannot create contract. Verifiy X account first.
                </p>
            )}
        </div>
    );
}
