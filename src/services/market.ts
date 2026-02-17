import { db } from '../db/client.js';
import {
    contractTemplates,
    marketContractInstances,
    marketStatsCache,
    type MarketContractInstance,
    type ContractTemplate,
    type MarketStatsCache,
} from '../db/schema.js';
import { eq, and, desc, asc, gt, gte, lte, inArray, sql } from 'drizzle-orm';
import { seedCatalog } from '../db/seed-catalog.js';

// =============================================================================
// TYPES
// =============================================================================

export interface MarketFeedOptions {
    sort?: 'trending_1h' | 'trending_24h' | 'new' | 'closing_soon' | 'volume_24h';
    category?: string;
    provider?: string;
    status?: 'published' | 'closing';
    limit?: number;
    offset?: number;
}

export interface MarketItem {
    instanceId: string;
    id: string; // Added for frontend compatibility
    status: string;
    publishAt: string;
    fundingCloseAt: string;
    capacityRemaining: number | null; // Restored
    costCents: number;
    maxCostCents: number; // Added for catalog
    template: {
        slug: string;
        name: string;
        title: string;
        description: string;
        category: string;
        provider: string;
        tierOptions: any;
        rules: any; // Added for catalog (window_days)
    };
    // Smart Tier Fields
    tier: string;
    multiplier: number;
    metricKey: string;
    displayTargetHint: string | null;
    // status: string; // Removed duplicate
    uiBadges: string[];
}

// =============================================================================
// PUBLIC FEED
// =============================================================================

export async function getMarketFeed(options: MarketFeedOptions = {}): Promise<MarketItem[]> {
    const {
        sort = 'trending_24h',
        category,
        provider,
        status,
        limit = 50,
        offset = 0,
    } = options;

    // Base query
    // Join instances -> templates -> stats
    // We select specific fields to keep payload small
    const query = db
        .select({
            instance: marketContractInstances,
            template: contractTemplates,
            stats: marketStatsCache,
        })
        .from(marketContractInstances)
        .innerJoin(contractTemplates, eq(marketContractInstances.templateId, contractTemplates.id))
        .leftJoin(marketStatsCache, eq(marketContractInstances.id, marketStatsCache.instanceId))
        .limit(Math.min(limit, 100))
        .offset(offset);

    // Filters
    const conditions = [];

    // 1. Status Filter (default: published or closing)
    if (status) {
        conditions.push(eq(marketContractInstances.status, status));
    } else {
        // Default: show published and closing, hide expired/paused
        conditions.push(inArray(marketContractInstances.status, ['published', 'closing']));
    }

    // 2. Category Filter
    if (category) {
        conditions.push(eq(contractTemplates.category, category));
    }

    // 3. Provider Filter
    if (provider) {
        conditions.push(eq(contractTemplates.provider, provider as any));
    }

    // 4. Expiry Safety (Don't show expired even if status says published)
    // condition: fundingCloseAt > now
    conditions.push(gt(marketContractInstances.fundingCloseAt, new Date()));

    if (conditions.length > 0) {
        query.where(and(...conditions));
    }

    // Sorting
    if (sort === 'new') {
        query.orderBy(desc(marketContractInstances.publishAt));
    } else if (sort === 'closing_soon') {
        query.orderBy(asc(marketContractInstances.fundingCloseAt));
    } else if (sort === 'trending_1h') {
        // Nulls last handling for stats
        query.orderBy(desc(marketStatsCache.executions1h));
    } else if (sort === 'trending_24h') {
        query.orderBy(desc(marketStatsCache.executions24h));
    } else if (sort === 'volume_24h') {
        query.orderBy(desc(marketStatsCache.capitalLocked24hCents));
    }

    const rows = await query;

    // Transform to DTO
    return rows.map(row => {
        const { instance, template, stats } = row;
        const now = new Date();
        const badges: string[] = [];

        // Compute badges
        if (stats) {
            if (stats.executions1h > 5) badges.push('TRENDING');
            if (stats.capitalLocked24hCents > 1000000) badges.push('HIGH_VOLUME'); // >$10k
        }

        const msUntilClose = instance.fundingCloseAt.getTime() - now.getTime();
        if (msUntilClose < 6 * 60 * 60 * 1000 && msUntilClose > 0) { // < 6 hours
            badges.push('CLOSING_SOON');
        }



        const isNew = (now.getTime() - instance.publishAt.getTime()) < 24 * 60 * 60 * 1000; // < 24h
        if (isNew) badges.push('NEW');

        return {
            instanceId: instance.id,
            id: instance.id, // Frontend expects .id
            status: instance.status,
            publishAt: instance.publishAt.toISOString(),
            fundingCloseAt: instance.fundingCloseAt.toISOString(),
            capacityRemaining: instance.capacityRemaining,
            costCents: instance.minLockCents || 0,
            maxCostCents: instance.maxLockCents || 200000,
            template: {
                slug: template.slug,
                name: template.title,
                title: template.title,
                description: template.description,
                category: template.category,
                provider: template.provider,
                tierOptions: template.tierOptionsJson,
                rules: template.rulesJson,
            },
            // Smart Tier Fields
            tier: instance.tier,
            multiplier: Number(instance.multiplier),
            metricKey: instance.metricKey,
            displayTargetHint: instance.displayTargetHint,

            stats: {
                executions1h: stats?.executions1h ?? 0,
                executions24h: stats?.executions24h ?? 0,
                capital24hCents: stats?.capitalLocked24hCents ?? 0,
                lastExecutionAt: stats?.lastExecutionAt?.toISOString() ?? null,
            },
            uiBadges: badges,
        };
    });
}

export async function getGlobalStats() {
    // efficient aggregation
    // For now, just count active instances and sum some stats
    // In strict production we'd use a separate materialized view or redis

    const [stats] = await db
        .select({
            activeCount: sql<number>`count(*)`,
            // approximate volume from cache
            volume24h: sql<number>`coalesce(sum(${marketStatsCache.capitalLocked24hCents}), 0)`,
        })
        .from(marketContractInstances)
        .leftJoin(marketStatsCache, eq(marketContractInstances.id, marketStatsCache.instanceId))
        .where(eq(marketContractInstances.status, 'published'));

    // TVL is harder without a full ledger sum, so we'll estimate or leave as 0 for now
    // or sum capacityTotal - capacityRemaining for all active?
    // Let's just return what we have

    return {
        activeCount: Number(stats?.activeCount || 0),
        volume24hUsd: Number(stats?.volume24h || 0) / 100, // cents to usd
        tvlUsd: 0, // Placeholder
    };
}

// =============================================================================
// ADMIN / MANAGEMENT
// =============================================================================

export interface PublishDropParams {
    templateSlug: string;
    fundingCloseAt: Date;
    capacityTotal?: number;
    overrides?: {
        minLockCents?: number;
        maxLockCents?: number;
        tierOptions?: any;
    };
}

export async function publishDrop(params: PublishDropParams) {
    // 1. Find template
    const template = await db.query.contractTemplates.findFirst({
        where: eq(contractTemplates.slug, params.templateSlug)
    });

    if (!template) {
        throw new Error(`Template not found: ${params.templateSlug}`);
    }

    // 2. Create instance
    const [instance] = await db.insert(marketContractInstances).values({
        templateId: template.id,
        status: 'published',
        publishAt: new Date(),
        fundingCloseAt: params.fundingCloseAt,
        capacityTotal: params.capacityTotal,
        capacityRemaining: params.capacityTotal, // Start full
        minLockCents: params.overrides?.minLockCents,
        maxLockCents: params.overrides?.maxLockCents,
        instanceTermsJson: params.overrides?.tierOptions ? { tierOptions: params.overrides.tierOptions } : null,
    } as any).returning();

    // 3. Initialize stats cache (empty)
    await db.insert(marketStatsCache).values({
        instanceId: instance.id,
    });

    return instance;
}

export async function expireInstance(instanceId: string) {
    await db
        .update(marketContractInstances)
        .set({ status: 'expired' } as any)
        .where(eq(marketContractInstances.id, instanceId));
}

export async function getMarketListings(options: MarketFeedOptions = {}) {
    // 1. Get all published instances (published/closing)
    // Force status published, but allow other filters
    const instances = await getMarketFeed({ ...options, status: 'published', limit: options.limit || 100 });

    // Auto-spawn if low inventory (lazy worker)
    if (instances.length < 20) {
        seedCatalog().catch(e => console.error('[Market][AutoSeed] Failed:', e));
    }

    // 2. Transform to simplified "Listings" shape
    return instances.map(i => {
        const rules = i.template.rules || {};
        const windowDays = Number(rules.window_days || 7);

        return {
            id: i.instanceId,
            title: i.template.name,
            domain: i.template.category,
            provider: i.template.provider,
            slots_left: (i.capacityRemaining === null) ? 999 : i.capacityRemaining,
            min_stake: Math.floor(i.costCents / 100), // cents -> dollars
            max_stake: Math.floor(i.maxCostCents / 100), // cents -> dollars
            window_days: windowDays,
            tier_options: i.template.tierOptions, // Added for frontend calc
            open_until: i.fundingCloseAt, // Added
            state: i.status === 'published' ? 'OPEN' : 'CLOSED',

            // Smart Tier Fields
            tier: i.tier,
            multiplier: i.multiplier,
            metric_key: i.metricKey,
            target_hint: i.displayTargetHint
        };
    });
}
