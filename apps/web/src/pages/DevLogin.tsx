import { useState } from 'react';
import { runActionWithState, createActionState, getErrorMessage } from '../lib/api/run-action';
import { post, setAuthToken } from '../lib/api/api';

interface LoginResponse {
    user: { id: string; email: string };
    accessToken: string;
}

export function DevLogin({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [state, setState] = useState(createActionState());

    const handleLogin = async () => {
        if (!email) return;

        await runActionWithState(state, async () => {
            // Note: Manual post call because we don't have a specific hook in lib/hooks for auth yet
            return post<LoginResponse>('/auth/login', { email });
        }, (data) => {
            console.log('[DevLogin] Got token:', data.accessToken?.substring(0, 20) + '...');
            setAuthToken(data.accessToken);
            console.log('[DevLogin] Stored token, now:', localStorage.getItem('auth_token')?.substring(0, 20) + '...');
            onLogin();
        });
        setState({ ...state });
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dev Login</h1>
            <p className="mb-4 text-gray-600">
                Enter an email to create a test user or log in.
            </p>

            {state.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {getErrorMessage(state.error.code, 'Login failed')}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="test@example.com"
                />
            </div>

            <button
                onClick={handleLogin}
                disabled={state.loading || !email}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {state.loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    );
}
