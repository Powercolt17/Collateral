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
// Default: all operations enabled
const killSwitchState = {
    contractCreationEnabled: true,
    executionEnabled: true,
    settlementEnabled: true,
    verificationEnabled: true,
};
// =============================================================================
// KILL SWITCH API
// =============================================================================
export function isContractCreationEnabled() {
    return killSwitchState.contractCreationEnabled;
}
export function isExecutionEnabled() {
    return killSwitchState.executionEnabled;
}
export function isSettlementEnabled() {
    return killSwitchState.settlementEnabled;
}
export function isVerificationEnabled() {
    return killSwitchState.verificationEnabled;
}
// =============================================================================
// ADMIN SETTERS (for incident response only)
// =============================================================================
export function setContractCreationEnabled(enabled) {
    console.log(`⚠️ KILL SWITCH: contractCreationEnabled = ${enabled}`);
    killSwitchState.contractCreationEnabled = enabled;
}
export function setExecutionEnabled(enabled) {
    console.log(`⚠️ KILL SWITCH: executionEnabled = ${enabled}`);
    killSwitchState.executionEnabled = enabled;
}
export function setSettlementEnabled(enabled) {
    console.log(`⚠️ KILL SWITCH: settlementEnabled = ${enabled}`);
    killSwitchState.settlementEnabled = enabled;
}
export function setVerificationEnabled(enabled) {
    console.log(`⚠️ KILL SWITCH: verificationEnabled = ${enabled}`);
    killSwitchState.verificationEnabled = enabled;
}
// =============================================================================
// KILL ALL (emergency)
// =============================================================================
export function disableAllOperations() {
    console.log('🚨 EMERGENCY: All operations DISABLED');
    killSwitchState.contractCreationEnabled = false;
    killSwitchState.executionEnabled = false;
    killSwitchState.settlementEnabled = false;
    killSwitchState.verificationEnabled = false;
}
export function enableAllOperations() {
    console.log('✅ All operations ENABLED');
    killSwitchState.contractCreationEnabled = true;
    killSwitchState.executionEnabled = true;
    killSwitchState.settlementEnabled = true;
    killSwitchState.verificationEnabled = true;
}
// =============================================================================
// STATUS (for observability)
// =============================================================================
export function getKillSwitchStatus() {
    return { ...killSwitchState };
}
//# sourceMappingURL=kill-switches.js.map