/**
 * Kill Switches
 *
 * Admin config flags for incident response.
 * These disable specific system operations globally.
 *
 * In production, these would be read from:
 * - Environment variables
 * - Remote config (e.g., Consul, AWS Parameter Store)
 * - Database config table
 *
 * For now, we use in-memory state that defaults to enabled.
 */
interface KillSwitchState {
    contractCreationEnabled: boolean;
    executionEnabled: boolean;
    settlementEnabled: boolean;
    verificationEnabled: boolean;
}
export declare function isContractCreationEnabled(): boolean;
export declare function isExecutionEnabled(): boolean;
export declare function isSettlementEnabled(): boolean;
export declare function isVerificationEnabled(): boolean;
export declare function setContractCreationEnabled(enabled: boolean): void;
export declare function setExecutionEnabled(enabled: boolean): void;
export declare function setSettlementEnabled(enabled: boolean): void;
export declare function setVerificationEnabled(enabled: boolean): void;
export declare function disableAllOperations(): void;
export declare function enableAllOperations(): void;
export declare function getKillSwitchStatus(): KillSwitchState;
export {};
