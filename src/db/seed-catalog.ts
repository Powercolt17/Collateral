
import 'dotenv/config';
import { db } from './client.js';
import { contractTemplates, marketContractInstances, marketStatsCache } from './schema.js';
import { eq, and, gt } from 'drizzle-orm';

// =============================================================================
// STRICT TEMPLATE CATALOG (30 Items)
// =============================================================================
// Rules:
// - Verified Providers Only: STRIPE, X, SHOPIFY, AMAZON
// - Metrics: Revenue/Followers/Sales/Units only. No vanity metrics.
// - Tiers: Controlled (1.5x), Elevated (2.5x), Maximum (4.0x)

const TIER_OPTIONS = {
    controlled: 1.5,
    elevated: 2.5,
    maximum: 4.0
};

const TEMPLATES = [
    // --- STRIPE (Finance) - 7 Templates ---
    {
        slug: 'stripe-revenue-growth-7d',
        title: 'Net Revenue Growth (7d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 7 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 7 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-14d',
        title: 'Net Revenue Growth (14d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 14 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-30d',
        title: 'Net Revenue Growth (30d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 30 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-45d',
        title: 'Net Revenue Growth (45d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 45 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 45 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-60d',
        title: 'Net Revenue Growth (60d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 60 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 60 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-90d',
        title: 'Net Revenue Growth (90d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 90 days compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 90 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'stripe-revenue-growth-180d',
        title: 'Net Revenue Growth (180d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase Stripe net revenue over 6 months compared to baseline.',
        rules: { metricKey: 'stripe_net_revenue', window_days: 180 },
        tierOptions: TIER_OPTIONS
    },

    // --- X / TWITTER (Social) - 7 Templates ---
    {
        slug: 'x-follower-growth-7d',
        title: 'Follower Growth (7d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 7 days.',
        rules: { metricKey: 'x_followers', window_days: 7 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-14d',
        title: 'Follower Growth (14d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 14 days.',
        rules: { metricKey: 'x_followers', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-21d',
        title: 'Follower Growth (21d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 21 days.',
        rules: { metricKey: 'x_followers', window_days: 21 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-30d',
        title: 'Follower Growth (30d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 30 days.',
        rules: { metricKey: 'x_followers', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-45d',
        title: 'Follower Growth (45d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 45 days.',
        rules: { metricKey: 'x_followers', window_days: 45 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-60d',
        title: 'Follower Growth (60d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 60 days.',
        rules: { metricKey: 'x_followers', window_days: 60 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'x-follower-growth-90d',
        title: 'Follower Growth (90d)',
        category: 'social',
        provider: 'X',
        description: 'Grow your X audience count over 90 days.',
        rules: { metricKey: 'x_followers', window_days: 90 },
        tierOptions: TIER_OPTIONS
    },

    // --- SHOPIFY (Commerce) - 9 Templates ---
    // Net Sales
    {
        slug: 'shopify-net-sales-7d',
        title: 'Store Net Sales (7d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify Net Sales over 7 days.',
        rules: { metricKey: 'shopify_net_sales', window_days: 7 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-net-sales-14d',
        title: 'Store Net Sales (14d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify Net Sales over 14 days.',
        rules: { metricKey: 'shopify_net_sales', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-net-sales-30d',
        title: 'Store Net Sales (30d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify Net Sales over 30 days.',
        rules: { metricKey: 'shopify_net_sales', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-net-sales-60d',
        title: 'Store Net Sales (60d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify Net Sales over 60 days.',
        rules: { metricKey: 'shopify_net_sales', window_days: 60 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-net-sales-90d',
        title: 'Store Net Sales (90d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify Net Sales over 90 days.',
        rules: { metricKey: 'shopify_net_sales', window_days: 90 },
        tierOptions: TIER_OPTIONS
    },
    // Order Volume (Allowed by user prompt)
    {
        slug: 'shopify-order-volume-14d',
        title: 'Order Volume Growth (14d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase total order count over 14 days.',
        rules: { metricKey: 'shopify_order_volume', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-order-volume-30d',
        title: 'Order Volume Growth (30d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase total order count over 30 days.',
        rules: { metricKey: 'shopify_order_volume', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-order-volume-60d',
        title: 'Order Volume Growth (60d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase total order count over 60 days.',
        rules: { metricKey: 'shopify_order_volume', window_days: 60 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'shopify-order-volume-90d',
        title: 'Order Volume Growth (90d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase total order count over 90 days.',
        rules: { metricKey: 'shopify_order_volume', window_days: 90 },
        tierOptions: TIER_OPTIONS
    },

    // --- AMAZON (Commerce) - 7 Templates ---
    // Revenue
    {
        slug: 'amazon-revenue-14d',
        title: 'Amazon Revenue Growth (14d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon Marketplace revenue over 14 days.',
        rules: { metricKey: 'amazon_revenue', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'amazon-revenue-30d',
        title: 'Amazon Revenue Growth (30d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon Marketplace revenue over 30 days.',
        rules: { metricKey: 'amazon_revenue', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'amazon-revenue-60d',
        title: 'Amazon Revenue Growth (60d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon Marketplace revenue over 60 days.',
        rules: { metricKey: 'amazon_revenue', window_days: 60 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'amazon-revenue-90d',
        title: 'Amazon Revenue Growth (90d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon Marketplace revenue over 90 days.',
        rules: { metricKey: 'amazon_revenue', window_days: 90 },
        tierOptions: TIER_OPTIONS
    },
    // Units Sold (Allowed by user prompt)
    {
        slug: 'amazon-units-sold-14d',
        title: 'Units Sold Growth (14d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon FBA units sold over 14 days.',
        rules: { metricKey: 'amazon_units_sold', window_days: 14 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'amazon-units-sold-30d',
        title: 'Units Sold Growth (30d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon FBA units sold over 30 days.',
        rules: { metricKey: 'amazon_units_sold', window_days: 30 },
        tierOptions: TIER_OPTIONS
    },
    {
        slug: 'amazon-units-sold-60d',
        title: 'Units Sold Growth (60d)',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Increase Amazon FBA units sold over 60 days.',
        rules: { metricKey: 'amazon_units_sold', window_days: 60 },
        tierOptions: TIER_OPTIONS
    }
];

// =============================================================================
// SEED LOGIC
// =============================================================================

function getTierFromRandom(rand: number) {
    if (rand < 0.6) return 'controlled';
    if (rand < 0.9) return 'elevated';
    return 'maximum';
}

function getPolicyForTier(metricKey: string, tier: string, windowDays: number) {
    const isStripe = metricKey.startsWith('stripe');
    const isX = metricKey.startsWith('x');
    const isShopifySales = metricKey === 'shopify_net_sales';
    const isShopifyVolume = metricKey === 'shopify_order_volume';
    const isAmazonRev = metricKey === 'amazon_revenue';
    const isAmazonUnits = metricKey === 'amazon_units_sold';

    let minPct = 0;
    let maxPct = 0;
    // let floorAbs = 0; // Simplified floor for seed visualization

    if (tier === 'controlled') {
        if (isStripe || isShopifySales || isAmazonRev) { minPct = 8; maxPct = 15; }
        else if (isX) { minPct = 1; maxPct = 3; }
        else { minPct = 5; maxPct = 12; } // Vol/Units
    } else if (tier === 'elevated') {
        if (isStripe || isShopifySales || isAmazonRev) { minPct = 18; maxPct = 30; }
        else if (isX) { minPct = 4; maxPct = 7; }
        else { minPct = 15; maxPct = 25; }
    } else { // maximum
        if (isStripe || isShopifySales || isAmazonRev) { minPct = 35; maxPct = 60; }
        else if (isX) { minPct = 8; maxPct = 15; }
        else { minPct = 30; maxPct = 50; }
    }

    // Generate specific target for this listing (simulated "policy" range)
    return {
        mode: 'percentage_delta',
        min_pct: minPct,
        max_pct: maxPct,
        min_absolute_floor: 10 // heuristic
    };
}

function getHint(metricKey: string, policy: any, windowDays: number) {
    const noun = metricKey.includes('revenue') || metricKey.includes('sales') ? 'revenue' :
        metricKey.includes('followers') ? 'followers' :
            metricKey.includes('volume') ? 'orders' : 'units';

    return `Target: +${policy.min_pct}–${policy.max_pct}% ${noun} (${windowDays}d)`;
}

export async function seedCatalog() {
    console.log('[Seed] 🌱 Starting Catalog Seed...');

    // 1. Upsert Templates
    // We ignore 'updatedAt' to satisfy strict Typescript checks on the update object
    // Drizzle defaultNow() handles creation.
    for (const t of TEMPLATES) {
        await db.insert(contractTemplates)
            .values({
                slug: t.slug,
                title: t.title,
                category: t.category,
                provider: t.provider as any,
                description: t.description,
                rulesJson: t.rules,
                tierOptionsJson: t.tierOptions
            })
            .onConflictDoUpdate({
                target: contractTemplates.slug,
                set: {
                    title: t.title,
                    category: t.category,
                    provider: t.provider as any,
                    description: t.description,
                    rulesJson: t.rules,
                    tierOptionsJson: t.tierOptions
                }
            });
    }
    console.log(`[Seed] ✅ Ensured ${TEMPLATES.length} templates.`);

    // 2. Ensure Listings (20 Open)
    // - slotsTotal = 500
    // - slotsFilled = random(0-50)
    // - minStake = 2500, maxStake = 200000
    // - fundingCloseAt = 7 days from now

    // Get all templates to spawn from
    const allTemplates = await db.select().from(contractTemplates);

    // Check current open listings
    const currentOpen = await db.select().from(marketContractInstances)
        .where(gt(marketContractInstances.fundingCloseAt, new Date()));

    let activeCount = currentOpen.length;
    let createdCount = 0;
    const TARGET_OPEN = 20;

    console.log(`[Seed] Found ${activeCount} active listings. Target ${TARGET_OPEN}.`);

    if (activeCount < TARGET_OPEN) {
        // Shuffle templates to pick random ones
        const shuffled = [...allTemplates].sort(() => 0.5 - Math.random());

        while (activeCount < TARGET_OPEN) {
            const t = shuffled[activeCount % shuffled.length];

            const filled = Math.floor(Math.random() * 51); // 0-50
            const fundingClose = new Date();
            fundingClose.setDate(fundingClose.getDate() + 7);

            // Tier Allocation
            const tier = getTierFromRandom(Math.random());
            const rules = t.rulesJson as any;
            // Safe access to tierOptions
            const tierOptions = t.tierOptionsJson as any;
            const multiplier = tierOptions ? (tierOptions[tier] || 1.5) : 1.5;
            const policy = getPolicyForTier(rules.metricKey, tier, rules.window_days);
            const hint = getHint(rules.metricKey, policy, rules.window_days);

            // We explicitly cast to 'any' to avoid strict type errors with Drizzle's inference
            // strictly matching the schema fields we know exist.
            const [newInstance] = await db.insert(marketContractInstances).values({
                templateId: t.id,
                // status defaults to 'published'
                publishAt: new Date(),
                fundingCloseAt: fundingClose,
                capacityTotal: 500,
                capacityRemaining: 500 - filled,
                minLockCents: 2500,
                maxLockCents: 200000,
                termsVersion: 1,

                // Smart Tier Fields
                tier: tier,
                multiplier: multiplier.toString(),
                metricKey: rules.metricKey,
                targetPolicyJson: policy,
                displayTargetHint: hint
            } as any).returning();

            // Init stats
            await db.insert(marketStatsCache).values({
                instanceId: newInstance.id
            } as any);

            activeCount++;
            createdCount++;
        }
    }

    console.log(`[Seed] 🚀 Created ${createdCount} new listings.`);
    console.log('[Seed] Done.');
}

// Run if main
if (process.argv[1] === import.meta.filename) {
    seedCatalog()
        .then(() => process.exit(0))
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
}
