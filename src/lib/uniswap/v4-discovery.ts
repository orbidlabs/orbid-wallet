import knownPoolsData from './pools/chain/480/v4-pools.json';


export interface V4PoolConfig {
    fee: number;
    tickSpacing: number;
    hooks: string;
}

interface KnownPool {
    symbol: string;
    token0: string;
    token0Symbol: string;
    token1: string;
    token1Symbol: string;
    fee: number;
    tickSpacing: number;
    hooks: string;
    uniswapUrl?: string;
    notes?: string;
}

interface PoolsDatabase {
    version: string;
    network: string;
    chainId: number;
    pools: KnownPool[];
}

const POOLS_DB = knownPoolsData as PoolsDatabase;

function createPoolKey(token0: string, token1: string): string {
    const t0 = token0.toLowerCase();
    const t1 = token1.toLowerCase();
    return t0 < t1 ? `${t0}_${t1}` : `${t1}_${t0}`;
}

export function getV4PoolConfigs(tokenA: string, tokenB: string): V4PoolConfig[] {
    const poolKey = createPoolKey(tokenA, tokenB);

    console.log(`[V4Discovery] Looking up pool: ${poolKey}`);

    const knownPool = POOLS_DB.pools.find(pool => {
        const dbKey = createPoolKey(pool.token0, pool.token1);
        return dbKey === poolKey;
    });

    if (knownPool) {
        console.log(`[V4Discovery] ✅ Found known pool: ${knownPool.symbol}`, {
            fee: knownPool.fee,
            tickSpacing: knownPool.tickSpacing,
            uniswapUrl: knownPool.uniswapUrl
        });

        return [{
            fee: knownPool.fee,
            tickSpacing: knownPool.tickSpacing,
            hooks: knownPool.hooks
        }];
    }

    return [
        { fee: 100, tickSpacing: 1, hooks: '0x0000000000000000000000000000000000000000' },    // 0.01%
        { fee: 500, tickSpacing: 10, hooks: '0x0000000000000000000000000000000000000000' },   // 0.05%
        { fee: 3000, tickSpacing: 60, hooks: '0x0000000000000000000000000000000000000000' },  // 0.3%
        { fee: 10000, tickSpacing: 200, hooks: '0x0000000000000000000000000000000000000000' }, // 1%
    ];
}

const poolCache = new Map<string, V4PoolConfig>();

export function cachePoolConfig(tokenA: string, tokenB: string, config: V4PoolConfig): void {
    const key = createPoolKey(tokenA, tokenB);
    poolCache.set(key, config);
    console.log(`[V4Discovery] 💾 Cached config for ${key}:`, config);
}

export function getCachedPoolConfig(tokenA: string, tokenB: string): V4PoolConfig | undefined {
    const key = createPoolKey(tokenA, tokenB);
    return poolCache.get(key);
}
