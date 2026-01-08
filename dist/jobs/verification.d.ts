/**
 * Verification Worker
 *
 * Background job that runs at deadline:
 * - Finds contracts in LOCKED state past deadline
 * - Evaluates via platform adapter
 * - Settles or forfeits based on result
 *
 * No manual override endpoints. Fully automatic.
 * State is NEVER stored - derived from ledger events.
 */
interface PlatformAdapter {
    platform: string;
    evaluate(contract: any): Promise<{
        pass: boolean;
        observedValue: number;
        threshold: number;
        operator: string;
        evidence: Record<string, unknown>;
    }>;
}
export declare function registerAdapter(adapter: PlatformAdapter): void;
/**
 * Run verification for all due contracts
 */
export declare function runVerificationJob(): Promise<void>;
export {};
