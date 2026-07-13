import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';
import { db } from '../db/client.js';
import { cltrBlockchainEvents } from '../db/schema.js';
import { sql, desc } from 'drizzle-orm';

const cleanAddress = (addr: string | undefined): string => (addr || '').replace(/['"]/g, '').trim();

// Robinhood Chain Mainnet defaults if missing
const RPC_URL = cleanAddress(process.env.VITE_ROBINHOOD_RPC_URL) || 'https://rpc.mainnet.chain.robinhood.com';

const CLTR_TOKEN_ADDRESS = (cleanAddress(process.env.VITE_CLTR_TOKEN) || '0x7b69C7E57d7004EB2374E5Aabb9db5334aE73B9f') as `0x${string}`;
const STAKING_ADDRESS = (cleanAddress(process.env.VITE_STAKING) || '0x6A95484e05dD7139C7A4De192dd2f26A2a91F69e') as `0x${string}`;
const FOUNDER_VESTING_ADDRESS = (cleanAddress(process.env.VITE_FOUNDER_VESTING) || '0xc416547c5a9dE39A5E489d04a3dfa1C043E8f026') as `0x${string}`;
const TEAM_VESTING_ADDRESS = (cleanAddress(process.env.VITE_TEAM_VESTING) || '0x05A67f5d26F3561C94E9e32A9F36fb483b51dB59') as `0x${string}`;
const BURN_MANAGER_ADDRESS = (cleanAddress(process.env.VITE_BURN_MANAGER) || '0x0000000000000000000000000000000000000000') as `0x${string}`;
const SETTLEMENT_ADDRESS = (cleanAddress(process.env.VITE_SETTLEMENT) || '0x6A95484e05dD7139C7A4De192dd2f26A2a91F69e') as `0x${string}`;

// Viem Client
const client = createPublicClient({
    transport: http(RPC_URL)
});

// ABIs parsed via Viem parseAbiItem
const STAKED_EVENT = parseAbiItem('event Staked(address indexed user, uint256 amount, uint256 duration)');
const UNSTAKED_EVENT = parseAbiItem('event Unstaked(address indexed user, uint256 amount)');
const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');
const RELEASED_EVENT = parseAbiItem('event ERC20Released(address indexed token, uint256 amount)');
const SETTLED_EVENT = parseAbiItem('event Settled(bytes32 indexed contractId, address indexed user, uint256 amount)');

/**
 * Get starting block for indexer backfill
 */
async function getLastIndexedBlock(): Promise<bigint> {
    try {
        const result = await db.execute(sql`
            SELECT MAX(block_number) as max_block FROM cltr_blockchain_events
        `);
        const max = result[0]?.max_block;
        return max ? BigInt(max as any) : 0n;
    } catch {
        return 0n;
    }
}

/**
 * Index a chunk of blocks
 */
export async function indexBlockRange(fromBlock: bigint, toBlock: bigint) {
    console.log(`[indexer] Indexing blocks from ${fromBlock} to ${toBlock}...`);

    const eventsToInsert: any[] = [];

    // 1. Fetch Transfer events (Burns)
    try {
        const transferLogs = await client.getLogs({
            address: CLTR_TOKEN_ADDRESS,
            event: TRANSFER_EVENT,
            args: {
                to: '0x0000000000000000000000000000000000000000' // sent to burn address
            },
            fromBlock,
            toBlock
        });

        for (const log of transferLogs) {
            eventsToInsert.push({
                eventType: 'BURN',
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
                blockTimestamp: new Date(), // Approximate or read via cache
                sender: log.args.from || '0x00',
                amount: formatUnits(log.args.value || 0n, 18),
                metadataJson: {}
            });
        }
    } catch (e: any) {
        console.error(`[indexer] Failed fetching Transfer logs: ${e.message}`);
    }

    // 2. Fetch Staked events
    try {
        const stakeLogs = await client.getLogs({
            address: STAKING_ADDRESS,
            event: STAKED_EVENT,
            fromBlock,
            toBlock
        });

        for (const log of stakeLogs) {
            eventsToInsert.push({
                eventType: 'STAKE',
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
                blockTimestamp: new Date(),
                sender: log.args.user || '0x00',
                amount: formatUnits(log.args.amount || 0n, 18),
                metadataJson: { duration: Number(log.args.duration || 0) }
            });
        }
    } catch (e: any) {
        console.error(`[indexer] Failed fetching Stake logs: ${e.message}`);
    }

    // 3. Fetch Unstaked events
    try {
        const unstakeLogs = await client.getLogs({
            address: STAKING_ADDRESS,
            event: UNSTAKED_EVENT,
            fromBlock,
            toBlock
        });

        for (const log of unstakeLogs) {
            eventsToInsert.push({
                eventType: 'UNSTAKE',
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
                blockTimestamp: new Date(),
                sender: log.args.user || '0x00',
                amount: formatUnits(log.args.amount || 0n, 18),
                metadataJson: {}
            });
        }
    } catch (e: any) {
        console.error(`[indexer] Failed fetching Unstake logs: ${e.message}`);
    }

    // 4. Fetch Vesting Releases (Founder & Team)
    const vestingWallets = [FOUNDER_VESTING_ADDRESS, TEAM_VESTING_ADDRESS];
    for (const wallet of vestingWallets) {
        if (wallet === '0x0000000000000000000000000000000000000000') continue;
        try {
            const releaseLogs = await client.getLogs({
                address: wallet,
                event: RELEASED_EVENT,
                fromBlock,
                toBlock
            });

            for (const log of releaseLogs) {
                eventsToInsert.push({
                    eventType: 'VESTING_RELEASE',
                    txHash: log.transactionHash,
                    blockNumber: log.blockNumber,
                    blockTimestamp: new Date(),
                    sender: wallet,
                    amount: formatUnits(log.args.amount || 0n, 18),
                    metadataJson: { token: log.args.token }
                });
            }
        } catch (e: any) {
            console.error(`[indexer] Failed fetching Release logs for ${wallet}: ${e.message}`);
        }
    }

    // 5. Fetch Settlements
    try {
        const settlementLogs = await client.getLogs({
            address: SETTLEMENT_ADDRESS,
            event: SETTLED_EVENT,
            fromBlock,
            toBlock
        });

        for (const log of settlementLogs) {
            eventsToInsert.push({
                eventType: 'SETTLEMENT',
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
                blockTimestamp: new Date(),
                sender: log.args.user || '0x00',
                amount: formatUnits(log.args.amount || 0n, 18),
                metadataJson: { contractId: log.args.contractId }
            });
        }
    } catch (e: any) {
        console.error(`[indexer] Failed fetching Settlement logs: ${e.message}`);
    }

    // Insert events into DB (onConflictDoNothing prevents duplicates)
    if (eventsToInsert.length > 0) {
        console.log(`[indexer] Inserting ${eventsToInsert.length} blockchain events...`);
        for (const ev of eventsToInsert) {
            try {
                // Approximate block timestamp dynamically to reduce node pressure
                const block = await client.getBlock({ blockNumber: ev.blockNumber });
                ev.blockTimestamp = new Date(Number(block.timestamp) * 1000);

                await db.insert(cltrBlockchainEvents)
                    .values(ev)
                    .onConflictDoNothing({ target: cltrBlockchainEvents.txHash });
            } catch (err: any) {
                console.error(`[indexer] Failed inserting event ${ev.txHash}: ${err.message}`);
            }
        }
    }
}

/**
 * Main Runner Trigger called by Worker Daemon
 */
export async function runIndexerIteration() {
    try {
        const headBlock = await client.getBlockNumber();
        // Read 5 blocks behind head to prevent chain reorgs issues
        const safeHead = headBlock - 5n;
        const lastIndexed = await getLastIndexedBlock();

        if (lastIndexed >= safeHead) {
            console.log(`[indexer] Already synchronized up to date.`);
            return;
        }

        // Genesis or start block
        let start = lastIndexed > 0n ? lastIndexed + 1n : safeHead - 1000n;
        if (start < 0n) start = 0n;

        // Process in chunks of max 2000 blocks to prevent RPC timeouts
        const CHUNK_SIZE = 2000n;
        let current = start;

        while (current <= safeHead) {
            const next = current + CHUNK_SIZE > safeHead ? safeHead : current + CHUNK_SIZE;
            await indexBlockRange(current, next);
            current = next + 1n;
        }

        console.log(`[indexer] Finished indexing iteration.`);
    } catch (e: any) {
        console.error(`[indexer] Indexer iteration failed: ${e.message}`);
    }
}
