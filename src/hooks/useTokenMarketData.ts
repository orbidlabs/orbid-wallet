'use client';

import { useQuery } from '@tanstack/react-query';
import { WORLD_CHAIN_TOKENS, COINGECKO_IDS } from '@/lib/tokens';

export type ChartPeriod = '1d' | '7d' | '30d' | '365d' | 'max';

export interface PricePoint {
    timestamp: number;
    price: number;
    volume?: number;
}

export interface TokenMarketData {
    price: number;
    change24h: number;
    change7d: number;
    volume24h: number;
    marketCap: number;
    fdv: number;
    high24h: number;
    low24h: number;
    priceHistory: PricePoint[];
}

const PERIOD_TO_DAYS: Record<ChartPeriod, string> = {
    '1d': '1',
    '7d': '7',
    '30d': '30',
    '365d': '365',
    'max': 'max'
};

/** Fetch market data from DEX Screener, GeckoTerminal or CoinGecko (fallback) */
async function fetchMarketData(symbol: string, period: ChartPeriod): Promise<TokenMarketData> {
    const token = WORLD_CHAIN_TOKENS.find(t => t.symbol === symbol);
    const days = PERIOD_TO_DAYS[period];
    const geckoId = COINGECKO_IDS[symbol];

    // Priority 1: DEX Screener (Stats) + GeckoTerminal (Charts) for World Chain Native
    if (token?.address) {
        try {
            const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.address}`);
            const dexData = await dexResponse.json();

            // Find the best pair specifically on World Chain
            const pair = dexData.pairs?.find((p: any) =>
                p.chainId === 'worldchain' &&
                p.baseToken.address.toLowerCase() === token.address.toLowerCase()
            ) || dexData.pairs?.[0];

            if (pair) {
                let priceHistory: PricePoint[] = [];

                // Always try GeckoTerminal first for Chart Data on World Chain
                try {
                    const poolsRes = await fetch(`https://api.geckoterminal.com/api/v2/networks/worldchain/tokens/${token.address}/pools`, {
                        headers: { 'Accept': 'application/json;version=20230203' }
                    });

                    if (poolsRes.ok) {
                        const poolsData = await poolsRes.json();
                        const pool = poolsData.data?.[0];

                        if (pool) {
                            const poolAddress = pool.attributes.address;
                            const tf = period === '1d' ? 'hour' : 'day';
                            const limit = period === '1d' ? 24 : (period === '7d' ? 7 : (period === '30d' ? 30 : 100));

                            const ohlcvRes = await fetch(
                                `https://api.geckoterminal.com/api/v2/networks/worldchain/pools/${poolAddress}/ohlcv/${tf}?limit=${limit}`,
                                { headers: { 'Accept': 'application/json;version=20230203' } }
                            );

                            if (ohlcvRes.ok) {
                                const ohlcvData = await ohlcvRes.json();
                                const ohlcvList = ohlcvData.data?.attributes?.ohlcv_list || [];

                                priceHistory = ohlcvList.map(([ts, o, h, l, c, v]: [number, number, number, number, number, number]) => ({
                                    timestamp: ts * 1000,
                                    price: c,
                                    volume: v
                                })).reverse();
                            }
                        }
                    }
                } catch (ce) {
                    console.warn(`GeckoTerminal chart fallback for ${symbol}`, ce);
                }

                // If GeckoTerminal failed, try CoinGecko for charts if we have an ID
                if (priceHistory.length === 0 && geckoId) {
                    try {
                        const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`);
                        if (chartRes.ok) {
                            const chartData = await chartRes.json();
                            priceHistory = (chartData.prices || []).map(([timestamp, price]: [number, number], index: number) => ({
                                timestamp,
                                price,
                                volume: chartData.total_volumes?.[index]?.[1] || 0
                            }));
                        }
                    } catch (ge) {
                        console.warn(`CoinGecko chart fallback for ${symbol}`, ge);
                    }
                }

                return {
                    price: parseFloat(pair.priceUsd || '0'),
                    change24h: pair.priceChange?.h24 || 0,
                    change7d: 0,
                    volume24h: pair.volume?.h24 || 0,
                    marketCap: pair.marketCap || 0,
                    fdv: pair.fdv || 0,
                    high24h: 0,
                    low24h: 0,
                    priceHistory
                };
            }
        } catch (e) {
            console.error(`DEX Screener primary failed for ${symbol}`, e);
        }
    }

    // Priority 2: CoinGecko (only for non-World Chain logic or major fallback)
    if (geckoId) {
        try {
            const [marketRes, chartRes] = await Promise.all([
                fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}?localization=false&tickers=false&community_data=false&developer_data=false`),
                fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`)
            ]);

            if (marketRes.ok) {
                const marketData = await marketRes.json();
                let priceHistory: PricePoint[] = [];

                if (chartRes.ok) {
                    const chartData = await chartRes.json();
                    priceHistory = (chartData.prices || []).map(([timestamp, price]: [number, number], index: number) => ({
                        timestamp,
                        price,
                        volume: chartData.total_volumes?.[index]?.[1] || 0
                    }));
                }

                return {
                    price: marketData.market_data?.current_price?.usd || 0,
                    change24h: marketData.market_data?.price_change_percentage_24h || 0,
                    change7d: marketData.market_data?.price_change_percentage_7d || 0,
                    volume24h: marketData.market_data?.total_volume?.usd || 0,
                    marketCap: marketData.market_data?.market_cap?.usd || 0,
                    fdv: marketData.market_data?.fully_diluted_valuation?.usd || 0,
                    high24h: marketData.market_data?.high_24h?.usd || 0,
                    low24h: marketData.market_data?.low_24h?.usd || 0,
                    priceHistory
                };
            }
        } catch (e) {
            console.warn(`CoinGecko final fallback failed for ${symbol}`, e);
        }
    }

    return {
        price: 0,
        change24h: 0,
        change7d: 0,
        volume24h: 0,
        marketCap: 0,
        fdv: 0,
        high24h: 0,
        low24h: 0,
        priceHistory: []
    };
}

/** Hook for fetching token market data with caching */
export function useTokenMarketData(symbol: string, period: ChartPeriod = '30d') {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['tokenMarketData', symbol, period],
        queryFn: () => fetchMarketData(symbol, period),
        staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
        gcTime: 30 * 60 * 1000,        // Keep in cache for 30 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        enabled: !!symbol
    });

    return {
        data: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch
    };
}
