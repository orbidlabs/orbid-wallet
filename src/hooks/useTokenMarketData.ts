'use client';

import { useQuery } from '@tanstack/react-query';
import { COINGECKO_IDS } from '@/lib/tokens';

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

/** Fetch market data from CoinGecko API */
async function fetchMarketData(symbol: string, period: ChartPeriod): Promise<TokenMarketData> {
    const geckoId = COINGECKO_IDS[symbol];
    if (!geckoId) {
        throw new Error('Token not found');
    }

    const days = PERIOD_TO_DAYS[period];

    const [marketRes, chartRes] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}?localization=false&tickers=false&community_data=false&developer_data=false`),
        fetch(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`)
    ]);

    if (!marketRes.ok) {
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

    const marketData = await marketRes.json();
    let priceHistory: PricePoint[] = [];

    if (chartRes.ok) {
        const chartData = await chartRes.json();
        const prices = chartData.prices || [];
        const volumes = chartData.total_volumes || [];

        priceHistory = prices.map(([timestamp, price]: [number, number], index: number) => {
            const volume = volumes[index]?.[1] || 0;
            return { timestamp, price, volume };
        });
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

/** Hook for fetching token market data with caching */
export function useTokenMarketData(symbol: string, period: ChartPeriod = '30d') {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['tokenMarketData', symbol, period],
        queryFn: () => fetchMarketData(symbol, period),
        staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
        gcTime: 30 * 60 * 1000,        // Keep in cache for 30 minutes
        refetchOnWindowFocus: false,
        retry: 2,
        enabled: !!symbol && !!COINGECKO_IDS[symbol]
    });

    return {
        data: data ?? null,
        isLoading,
        error: error?.message ?? null,
        refetch
    };
}
