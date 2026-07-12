import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID || '1467417e2e8e9de7d8d21dfbc2ccf28e';
const RPC_URL = import.meta.env.VITE_ROBINHOOD_RPC_URL || 'https://rpc.mainnet.chain.robinhood.com';

const robinhoodChain = {
    id: 4663,
    name: 'Robinhood Chain',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [RPC_URL] },
    },
    blockExplorers: {
        default: { name: 'Robinhood Explorer', url: 'https://explorer.mainnet.chain.robinhood.com' },
    }
};

const networks = [robinhoodChain];
export const wagmiAdapter = new WagmiAdapter({
    projectId: PROJECT_ID,
    networks
});

export const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId: PROJECT_ID,
    features: {
        email: false,
        socials: false,
        analytics: false
    },
    themeMode: 'light',
    themeVariables: {
        '--w3m-accent': '#5C1414',
        '--w3m-color-mix': '#5C1414',
        '--w3m-font-family': 'Sora, sans-serif',
        '--w3m-border-radius-master': '4px',
        '--w3m-watermark-display': 'none'
    },
    metadata: {
        name: 'CLTR Identity Terminal',
        description: 'Credibility Ambition Protocol',
        url: window.location.origin,
        icons: [window.location.origin + '/favicon.ico']
    }
});

window.wagmiAdapter = wagmiAdapter;
window.appKit = modal;
