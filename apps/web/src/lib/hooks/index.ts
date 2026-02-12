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
} from './use-connect-x.ts';

// Create Contract
export {
    createContract,
    type CreateContractParams,
    type CreateContractResponse,
} from './use-create-contract.ts';

// Funding
export {
    createFundingIntent,
    waitForFundsLocked,
    type FundingIntentResponse,
    type FundingResult,
} from './use-funding.ts';

// Execute
export {
    executeContract,
    watchUntilTerminal,
    type ExecuteResponse,
} from './use-execute.ts';

// Contract Detail
export {
    fetchContractDetail,
    fetchContractList,
    startDetailPolling,
    startSmartPolling,
} from './use-contract-detail.ts';

