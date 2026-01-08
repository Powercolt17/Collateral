import { useState, useEffect } from 'react';
import {
    startXConnection,
    verifyXConnection,
    getXConnectionStatus,
} from '../lib/hooks/use-connect-x';
import type { XConnectionStatus } from '../lib/hooks/use-connect-x';
import { getErrorMessage, runActionWithState, createActionState } from '../lib/api/run-action';

export function ConnectXPage({ onNext }: { onNext: () => void }) {
    const [status, setStatus] = useState<XConnectionStatus | null>(null);
    const [username, setUsername] = useState('');
    const [challenge, setChallenge] = useState<string | null>(null);

    // Action states
    const [startState, setStartState] = useState(createActionState());
    const [verifyState, setVerifyState] = useState(createActionState());

    // Check status on mount
    useEffect(() => {
        getXConnectionStatus().then(result => {
            if (result.data) {
                setStatus(result.data);
                if (result.data.verified) {
                    onNext(); // Auto-advance if already verified
                }
            }
        });
    }, [onNext]);

    const handleStart = async () => {
        if (!username.trim()) return;

        await runActionWithState(startState, () => startXConnection(username.trim()), (response) => {
            console.log('[ConnectXPage] startXConnection response:', response);
            // Response is wrapped: { data: { challengeCode: ... } }
            const data = (response as any).data || response;
            const code = data.challengeCode || data.codeMasked || 'No code found';
            console.log('[ConnectXPage] Setting challenge to:', code);
            setChallenge(code);
            setStatus({ connected: false, verified: false });
        });
        setStartState({ ...startState }); // trigger re-render
    };

    const handleVerify = async () => {
        await runActionWithState(verifyState, verifyXConnection, (data) => {
            const res = data as any;
            if (res.verificationStatus === 'VERIFIED') {
                setStatus({
                    connected: true,
                    verified: true,
                    accountId: res.xUserId
                });
                onNext();
            }
        });
        setVerifyState({ ...verifyState }); // trigger re-render
    };

    if (status?.verified) {
        return (
            <div className="p-8 max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4 text-green-600">X Connected</h1>
                <p className="mb-4">Verified!</p>
                <button
                    onClick={onNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Continue
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Connect X Account</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Step 1: Get Challenge Code</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">X Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="@yourhandle"
                        className="w-full p-2 border rounded"
                    />
                </div>

                {startState.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {getErrorMessage(startState.error.code, startState.error.message)}
                    </div>
                )}

                <button
                    onClick={handleStart}
                    disabled={startState.loading || !username.trim()}
                    className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                    {startState.loading ? 'Starting...' : 'Start Connection'}
                </button>

                {challenge && (
                    <div className="mt-4 p-4 bg-gray-100 rounded border border-gray-300">
                        <p className="text-sm text-gray-600 mb-2">Add this code to your X bio:</p>
                        <code className="block text-xl font-mono p-2 bg-white rounded select-all">
                            {challenge}
                        </code>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Step 2: Verify</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Once you've added the code to your bio, click Verify.
                </p>

                {verifyState.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {getErrorMessage(verifyState.error.code, verifyState.error.message)}
                    </div>
                )}

                <button
                    onClick={handleVerify}
                    disabled={verifyState.loading || !challenge}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {verifyState.loading ? 'Verifying...' : 'Verify Connection'}
                </button>
            </div>
        </div>
    );
}
