/**
 * Frontend Hooks Index
 * 
 * Export all hooks for the golden path flow.
 */

// Connect X
export {
    startXConnection,
    verifyXConnection,
    getXConnectionStatus,
    type XStartResponse,
    type XVerifyResponse,
    type XConnectionStatus,
} from './use-connect-x.js';

// Create Contract
export {
    createContract,
    type CreateContractParams,
    type CreateContractResponse,
} from './use-create-contract.js';

// Funding
export {
    createFundingIntent,
    waitForFundsLocked,
    type FundingIntentResponse,
    type FundingResult,
} from './use-funding.js';

// Execute
export {
    executeContract,
    watchUntilTerminal,
    type ExecuteResponse,
} from './use-execute.js';

// Contract Detail
export {
    fetchContractDetail,
    fetchContractList,
    startDetailPolling,
    startSmartPolling,
} from './use-contract-detail.js';
