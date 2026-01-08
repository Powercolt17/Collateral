/**
 * Frontend Wiring Layer - Main Index
 * 
 * This module provides the complete frontend wiring for Collateral.
 * 
 * ARCHITECTURE:
 * - state/  → Contract state model (the UI's law book)
 * - api/    → API client, action helpers, polling
 * - hooks/  → Golden path flow hooks
 * 
 * GOLDEN PATH:
 * 1. Connect X → startXConnection, verifyXConnection
 * 2. Create → createContract
 * 3. Fund → createFundingIntent, waitForFundsLocked
 * 4. Execute → executeContract, watchUntilTerminal
 * 5. Observe → fetchContractDetail, events timeline
 */

// State Model
export * from './state/contract-states.js';

// API Client
export { get, post, ApiError, setAuthToken, clearAuthToken, hasAuthToken } from './api/api.js';

// Action Helpers
export { runAction, getErrorMessage, createActionState, runActionWithState, type ActionResult, type ActionState } from './api/run-action.js';

// Polling
export { startContractListPolling, startContractDetailPolling, pollUntilStable, type ContractListItem, type ContractDetail, type ContractEvent, type ContractDetailResponse } from './api/polling.js';

// Hooks
export * from './hooks/index.js';
