import { useState, useEffect } from 'react';
import {
    startDetailPolling,
    fetchContractDetail,
} from '../lib/hooks/use-contract-detail';
// // import type { ContractDetailResponse } from '../lib/hooks/use-contract-detail';
import {
    createFundingIntent,
    waitForFundsLocked
} from '../lib/hooks/use-funding';
import {
    executeContract,
    watchUntilTerminal
} from '../lib/hooks/use-execute';
import {
    can,
    ContractAction,
    getStateMessage,
    getNextActionHint,
    ContractDerivedState
} from '../lib/state/contract-states';
import { runActionWithState, createActionState, getErrorMessage } from '../lib/api/run-action';

export function ContractDetailPage({ contractId, onBack }: { contractId: string, onBack: () => void }) {
    const [detail, setDetail] = useState<ContractDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [fundState, setFundState] = useState(createActionState());
    const [execState, setExecState] = useState(createActionState());

    // Initial load + Polling
    useEffect(() => {
        // Fetch initial
        fetchContractDetail(contractId).then(res => {
            if (res.data) setDetail(res.data);
            setLoading(false);
        });

        // Start auto-poll
        const cleanup = startDetailPolling(contractId, (data) => {
            setDetail(data);
        });
        return cleanup;
    }, [contractId]);

    const handleFund = async () => {
        if (!detail) return;

        await runActionWithState(fundState, () => createFundingIntent(contractId, detail.contract.derivedState), (data) => {
            // In a real app, redirect to data.checkoutUrl
            // For this demo, we assume "Test Mode" where backend triggers success via webhook simulation
            // So we just wait for FUNDS_LOCKED
            console.log('Funding Mock: Waiting for Stripe webhook...', data);
            alert('Funding initiated! In a real app, you would be redirected to Stripe. \n\nFor this LOCAL DEMO: Please trigger the Stripe webhook simulator now to proceed to FUNDS_LOCKED.');

            // Start watching for locked state
            waitForFundsLocked(contractId, (d) => setDetail(d), () => {
                console.log('Funds Locked!');
            });
        });
        setFundState({ ...fundState });
    };

    const handleExecute = async () => {
        if (!detail) return;

        await runActionWithState(execState, () => executeContract(contractId, detail.contract.derivedState), () => {
            // Start watching for terminal
            watchUntilTerminal(contractId, (d) => setDetail(d), (outcome) => {
                console.log('Terminal reached:', outcome);
            });
        });
        setExecState({ ...execState });
    };

    if (loading) return <div className="p-8">Loading contract...</div>;
    if (!detail) return <div className="p-8">Contract not found.</div>;

    const { contract, events } = detail;
    const state = contract.derivedState;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={onBack} className="text-gray-500 hover:text-black mb-4">← Back</button>

            <div className="bg-white border rounded shadow-sm p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Contract {contract.id.slice(0, 8)}</h1>
                        <p className="text-gray-600">{getStateMessage(state)}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded text-sm font-bold ${state === ContractDerivedState.SETTLED ? 'bg-green-100 text-green-800' :
                            state === ContractDerivedState.FORFEITED ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {state}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                        <div className="text-sm text-gray-500">Target</div>
                        <div className="font-semibold">{contract.metricType} ≥ {(contract.condition as any).threshold}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Lock Amount</div>
                        <div className="font-semibold text-lg">${contract.lockAmountUsdCents / 100}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Deadline</div>
                        <div className="font-semibold">{new Date(contract.deadlineUtc).toLocaleDateString()}</div>
                    </div>
                </div>

                <div className="flex gap-4 border-t pt-6">
                    {/* Fund Action */}
                    <div className="flex-1">
                        {fundState.error && <p className="text-red-500 text-sm mb-2">{getErrorMessage(fundState.error.code)}</p>}
                        <button
                            onClick={handleFund}
                            disabled={!can(ContractAction.FUND, state) || fundState.loading}
                            className="w-full px-4 py-2 bg-black text-white rounded disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                            {fundState.loading ? 'Processing...' : 'Fund Contract ($100)'}
                        </button>
                    </div>

                    {/* Execute Action */}
                    <div className="flex-1">
                        {execState.error && <p className="text-red-500 text-sm mb-2">{getErrorMessage(execState.error.code)}</p>}
                        <button
                            onClick={handleExecute}
                            disabled={!can(ContractAction.EXECUTE, state) || execState.loading}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                            {execState.loading ? 'Executing...' : 'Execute Contract'}
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                    {getNextActionHint(state)}
                </div>
            </div>

            {/* Receipt / Events Timeline */}
            <div className="bg-gray-50 border rounded p-6">
                <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4 border-b pb-2">Ledger Events</h3>
                <div className="space-y-3 font-mono text-sm">
                    {events.slice().reverse().map((inv: any) => (
                        <div key={inv.id} className="flex gap-4">
                            <span className="text-gray-400">{new Date(inv.timestampUtc).toLocaleTimeString()}</span>
                            <span className="font-bold text-gray-700">{inv.eventType}</span>
                            <span className="text-gray-500 flex-1 truncate text-right" title={inv.eventHash}>
                                {inv.eventHash.slice(0, 16)}...
                            </span>
                        </div>
                    ))}
                    {events.length === 0 && <div className="text-gray-400 italic">No events recorded.</div>}
                </div>
            </div>
        </div>
    );
}
