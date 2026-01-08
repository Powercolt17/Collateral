/**
 * Target Policy Module
 * 
 * Scaling difficulty logic - targets scale relative to baseline
 * Someone with 1M followers gets proportionally harder target than 1k
 */

export interface TargetTier {
    name: string;
    multiplier: number;
    description: string;
}

export interface SuggestedTargets {
    tiers: TargetTier[];
    baseline: number;
    metricType: string;
}

/**
 * Difficulty tiers
 * Higher baseline = harder relative target
 */
const DIFFICULTY_TIERS: TargetTier[] = [
    { name: 'EASY', multiplier: 1.1, description: '10% growth' },
    { name: 'MEDIUM', multiplier: 1.25, description: '25% growth' },
    { name: 'HARD', multiplier: 1.5, description: '50% growth' },
    { name: 'EXTREME', multiplier: 2.0, description: '100% growth' },
];

/**
 * Baseline scaling factors
 * Larger accounts have harder multipliers applied
 */
function getScalingFactor(baseline: number, metricType: string): number {
    // For followers/subscribers
    if (['FOLLOWERS', 'SUBSCRIBERS'].includes(metricType)) {
        if (baseline >= 1000000) return 0.7; // 1M+ gets 70% of target (harder)
        if (baseline >= 100000) return 0.8;  // 100k+ gets 80%
        if (baseline >= 10000) return 0.9;   // 10k+ gets 90%
        return 1.0; // Small accounts get full target
    }

    // For impressions/views (higher variance)
    if (['IMPRESSIONS', 'VIEWS'].includes(metricType)) {
        if (baseline >= 10000000) return 0.6;
        if (baseline >= 1000000) return 0.7;
        if (baseline >= 100000) return 0.8;
        return 1.0;
    }

    // For revenue (in cents)
    if (metricType === 'REVENUE') {
        if (baseline >= 100000000) return 0.6; // $1M+ revenue
        if (baseline >= 10000000) return 0.7;  // $100k+
        if (baseline >= 1000000) return 0.8;   // $10k+
        return 1.0;
    }

    return 1.0;
}

/**
 * Calculate suggested target tiers based on baseline
 */
export function calculateSuggestedTargets(
    baseline: number,
    metricType: string
): SuggestedTargets {
    const scalingFactor = getScalingFactor(baseline, metricType);

    const tiers = DIFFICULTY_TIERS.map(tier => {
        // Apply scaling factor to make larger accounts work harder
        const adjustedMultiplier = 1 + ((tier.multiplier - 1) / scalingFactor);
        const targetValue = Math.floor(baseline * adjustedMultiplier);

        return {
            name: tier.name,
            multiplier: adjustedMultiplier,
            description: `${tier.description} (target: ${formatMetricValue(targetValue, metricType)})`,
        };
    });

    return {
        tiers,
        baseline,
        metricType,
    };
}

/**
 * Validate a proposed target against baseline
 * Prevents trivially easy targets
 */
export function validateTarget(
    baseline: number,
    target: number,
    metricType: string
): { valid: boolean; reason?: string } {
    const minMultiplier = 1.05; // At least 5% growth required
    const maxMultiplier = 10.0; // Max 10x growth

    const proposedMultiplier = target / baseline;

    if (proposedMultiplier < minMultiplier) {
        return {
            valid: false,
            reason: `Target too easy. Minimum ${Math.floor((minMultiplier - 1) * 100)}% growth required.`,
        };
    }

    if (proposedMultiplier > maxMultiplier) {
        return {
            valid: false,
            reason: `Target unrealistic. Maximum ${maxMultiplier}x growth allowed.`,
        };
    }

    return { valid: true };
}

function formatMetricValue(value: number, metricType: string): string {
    if (metricType === 'REVENUE') {
        return `$${(value / 100).toLocaleString()}`;
    }
    return value.toLocaleString();
}
