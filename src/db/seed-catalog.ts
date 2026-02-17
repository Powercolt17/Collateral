
import 'dotenv/config';
import { db } from './client.js';
import { contractTemplates, marketContractInstances, marketStatsCache } from './schema.js';
import { eq, and, gt } from 'drizzle-orm';

// =============================================================================
// TEMPLATE DEFINITIONS (30+)
// =============================================================================

const TEMPLATES = [
    // --- FINANCE (Stripe) ---
    {
        slug: 'stripe-revenue-growth-7d',
        title: 'Revenue Growth (7d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase your Stripe revenue over 7 days compared to baseline.',
        rules: { metric: 'REVENUE', window_days: 7 },
        tierOptions: { standard: 1.1, advanced: 1.2, elite: 1.5 }
    },
    {
        slug: 'stripe-revenue-growth-30d',
        title: 'Revenue Growth (30d)',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase your Stripe revenue over 30 days compared to baseline.',
        rules: { metric: 'REVENUE', window_days: 30 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.8 }
    },
    {
        slug: 'stripe-reduce-disputes',
        title: 'Reduce Disputes',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Lower your dispute rate below 0.5% for 30 days.',
        rules: { metric: 'DISPUTE_RATE', window_days: 30 },
        tierOptions: { standard: 1.1, advanced: 1.3, elite: 1.5 }
    },
    {
        slug: 'stripe-payment-success',
        title: 'Increase Payment Success',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Improve payment success rate by 5% over 14 days.',
        rules: { metric: 'AUTH_RATE', window_days: 14 },
        tierOptions: { standard: 1.1, advanced: 1.25, elite: 1.4 }
    },
    {
        slug: 'stripe-mrr-growth',
        title: 'MRR Growth Sprint',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Grow Monthly Recurring Revenue by 10% in 30 days.',
        rules: { metric: 'MRR', window_days: 30 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 2.0 }
    },
    {
        slug: 'stripe-gross-volume-lift',
        title: 'Gross Volume Lift',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Increase total gross volume processed by 15% in 14 days.',
        rules: { metric: 'GROSS_VOLUME', window_days: 14 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.7 }
    },
    {
        slug: 'stripe-new-customers',
        title: 'New Customer Acquisition',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Acquire 50+ new paying customers in 7 days.',
        rules: { metric: 'NEW_CUSTOMERS', window_days: 7 },
        tierOptions: { standard: 1.2, advanced: 1.5, elite: 1.8 }
    },
    {
        slug: 'stripe-high-ticket-sales',
        title: 'High Ticket Sales',
        category: 'finance',
        provider: 'STRIPE',
        description: 'Process at least 5 transactions over $500 in 7 days.',
        rules: { metric: 'HIGH_TICKET_COUNT', window_days: 7 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 2.0 }
    },


    // --- SOCIAL (X) ---
    {
        slug: 'x-audience-builder-7d',
        title: 'Audience Builder (7d)',
        category: 'social',
        provider: 'X',
        description: 'Gain 100+ net new followers in 7 days.',
        rules: { metric: 'FOLLOWERS', window_days: 7 },
        tierOptions: { standard: 1.1, advanced: 1.3, elite: 1.5 }
    },
    {
        slug: 'x-impressions-lift',
        title: 'Impressions Lift',
        category: 'social',
        provider: 'X',
        description: 'Achieve 50k+ impressions on your posts in 7 days.',
        rules: { metric: 'IMPRESSIONS', window_days: 7 },
        tierOptions: { standard: 1.1, advanced: 1.25, elite: 1.4 }
    },
    {
        slug: 'x-engagement-lift',
        title: 'Engagement Lift',
        category: 'social',
        provider: 'X',
        description: 'Increase engagement rate by 20% over 7 days.',
        rules: { metric: 'ENGAGEMENT_RATE', window_days: 7 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.6 }
    },
    {
        slug: 'x-viral-thread',
        title: 'Viral Thread Sprint',
        category: 'social',
        provider: 'X',
        description: 'Publish a thread with 10k+ views in 48 hours.',
        rules: { metric: 'THREAD_VIEWS', window_days: 2 },
        tierOptions: { standard: 1.5, advanced: 2.0, elite: 3.0 }
    },
    {
        slug: 'x-profile-visits',
        title: 'Profile Traffic Surge',
        category: 'social',
        provider: 'X',
        description: 'Drive 1,000 profile visits in 7 days.',
        rules: { metric: 'PROFILE_VISITS', window_days: 7 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.7 }
    },
    {
        slug: 'x-audience-builder-30d',
        title: 'Audience Builder (30d)',
        category: 'social',
        provider: 'X',
        description: 'Gain 500+ net new followers in 30 days.',
        rules: { metric: 'FOLLOWERS', window_days: 30 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 2.0 }
    },
    {
        slug: 'x-power-poster',
        title: 'Power Poster Streak',
        category: 'social',
        provider: 'X',
        description: 'Post at least 3 times daily for 7 days straight.',
        rules: { metric: 'POST_FREQUENCY', window_days: 7 },
        tierOptions: { standard: 1.1, advanced: 1.3, elite: 1.5 }
    },


    // --- COMMERCE (Shopify/Amazon) ---
    {
        slug: 'shopify-sales-lift-14d',
        title: 'Sales Lift (14d)',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Shopify store sales by 10% over 14 days.',
        rules: { metric: 'SALES', window_days: 14 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.6 }
    },
    {
        slug: 'shopify-order-volume',
        title: 'Order Volume Growth',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Process 20% more orders than baseline in 14 days.',
        rules: { metric: 'ORDER_COUNT', window_days: 14 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.7 }
    },
    {
        slug: 'shopify-aov-boost',
        title: 'AOV Boost',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Increase Average Order Value by $10 over 30 days.',
        rules: { metric: 'AOV', window_days: 30 },
        tierOptions: { standard: 1.3, advanced: 1.5, elite: 1.8 }
    },
    {
        slug: 'amazon-rank-improvement',
        title: 'Best Seller Rank',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Improve BSR by 10% in main category over 7 days.',
        rules: { metric: 'BSR', window_days: 7 },
        tierOptions: { standard: 1.2, advanced: 1.5, elite: 2.0 }
    },
    {
        slug: 'amazon-review-velocity',
        title: 'Review Velocity',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Obtain 5+ verified reviews in 14 days.',
        rules: { metric: 'REVIEW_COUNT', window_days: 14 },
        tierOptions: { standard: 1.4, advanced: 1.8, elite: 2.2 }
    },
    {
        slug: 'shopify-conversion-rate',
        title: 'Conversion Rate Opt',
        category: 'commerce',
        provider: 'SHOPIFY',
        description: 'Improve store conversion rate to 2% over 7 days.',
        rules: { metric: 'CONVERSION_RATE', window_days: 7 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 1.9 }
    },
    {
        slug: 'amazon-fba-inventory',
        title: 'Inventory Turnover',
        category: 'commerce',
        provider: 'AMAZON',
        description: 'Sell through 100 units of FBA inventory in 7 days.',
        rules: { metric: 'UNITS_SOLD', window_days: 7 },
        tierOptions: { standard: 1.1, advanced: 1.3, elite: 1.5 }
    },


    // --- SALES (CRM/Salesforce/HubSpot - Placeholder) ---
    {
        slug: 'sales-appointments-7d',
        title: 'Appointments Booked',
        category: 'sales',
        provider: 'SALES', // Generic/CRM
        description: 'Book 10+ qualified appointments in 7 days.',
        rules: { metric: 'APPOINTMENTS', window_days: 7 },
        tierOptions: { standard: 1.2, advanced: 1.5, elite: 1.8 }
    },
    {
        slug: 'sales-premium-volume-30d',
        title: 'Premium Volume (30d)',
        category: 'sales',
        provider: 'SALES',
        description: 'Close $50k+ in new premium volume in 30 days.',
        rules: { metric: 'PREMIUM_VOLUME', window_days: 30 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 2.0 }
    },
    {
        slug: 'sales-clean-pipeline',
        title: 'Pipeline Cleanliness',
        category: 'sales',
        provider: 'SALES',
        description: 'Update 100% of open opportunities with next steps.',
        rules: { metric: 'CRM_HYGIENE', window_days: 5 },
        tierOptions: { standard: 1.1, advanced: 1.2, elite: 1.3 }
    },
    {
        slug: 'sales-outbound-calls',
        title: 'Outbound Warrior',
        category: 'sales',
        provider: 'SALES',
        description: 'Make 500+ outbound calls/dials in 5 days.',
        rules: { metric: 'CALL_VOLUME', window_days: 5 },
        tierOptions: { standard: 1.2, advanced: 1.4, elite: 1.6 }
    },
    {
        slug: 'sales-demo-conversion',
        title: 'Demo Conversion',
        category: 'sales',
        provider: 'SALES',
        description: 'Convert 30% of demos to closed-won deals (30d).',
        rules: { metric: 'DEMO_CONVERSION', window_days: 30 },
        tierOptions: { standard: 1.4, advanced: 1.7, elite: 2.1 }
    },
    {
        slug: 'sales-referral-generation',
        title: 'Referral Generation',
        category: 'sales',
        provider: 'SALES',
        description: 'Generate 5+ active referrals from existing clients.',
        rules: { metric: 'REFERRALS', window_days: 14 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 1.9 }
    },
    {
        slug: 'sales-contract-value',
        title: 'Contract Value Expansion',
        category: 'sales',
        provider: 'SALES',
        description: 'Upsell distinct clients to increase ACV by 10%.',
        rules: { metric: 'ACV_GROWTH', window_days: 30 },
        tierOptions: { standard: 1.3, advanced: 1.6, elite: 2.0 }
    }
];

// =============================================================================
// SEED LOGIC
// =============================================================================

export async function seedCatalog() {
    console.log('[Seed] 🌱 Starting Catalog Seed...');

    // 1. Upsert Templates
    for (const t of TEMPLATES) {
        // Upsert based on slug
        await db.insert(contractTemplates)
            .values({
                slug: t.slug,
                title: t.title,
                category: t.category,
                provider: t.provider as any, // Cast to enum
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
                    // updatedAt handled by DB or ignored
                }
            });
    }
    console.log(`[Seed] ✅ Ensure ${TEMPLATES.length} templates.`);

    // 2. Ensure Listings (Rotation Logic)
    // For each template, ensure at least one 'published' instance exists that closes > 24h from now

    // Get all templates
    const allTemplates = await db.select().from(contractTemplates);

    let createdCount = 0;

    for (const t of allTemplates) {
        // Check for existing active instance
        const existing = await db.select()
            .from(marketContractInstances)
            .where(and(
                eq(marketContractInstances.templateId, t.id),
                eq(marketContractInstances.status, 'published'),
                gt(marketContractInstances.fundingCloseAt, new Date())
            ))
            .limit(1);

        if (existing.length === 0) {
            // Create New Listing
            const daysOpen = (t.rulesJson as any).window_days || 7;
            const fundingClose = new Date();
            fundingClose.setDate(fundingClose.getDate() + 7); // Default 7 day window for joining

            // Init stats
            // We need the ID we just inserted. Drizzle returning() is best.
            // Re-inserting with returning() for simplicity in this loop logic is tricky if using raw SQL, 
            // but Drizzle .values().returning() works standardly.
            const [newInstance] = await db.insert(marketContractInstances).values({
                templateId: t.id,
                // status: 'published', // Use default
                publishAt: new Date(),
                fundingCloseAt: fundingClose,
                capacityTotal: 500,
                capacityRemaining: 500,
                minLockCents: 2500,
                maxLockCents: 200000,
                termsVersion: 1,
            } as any).returning();

            // Create stats cache
            // Create stats cache
            await db.insert(marketStatsCache).values({
                instanceId: newInstance.id
                // All other fields have defaults (0)
            });

            createdCount++;
        }
    }

    console.log(`[Seed] 🚀 Rotated/Created ${createdCount} new listings.`);
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
