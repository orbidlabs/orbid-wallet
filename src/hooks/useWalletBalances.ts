'use client';

import { useQuery } from '@tanstack/react-query';
import type { TokenBalance } from '@/lib/types';
import { WORLD_CHAIN_TOKENS, COINGECKO_IDS } from '@/lib/tokens';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ALCHEMY_RPC = `https://worldchain-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

const BALANCE_OF_SELECTOR = '0x70a08231';

interface TokenPrice {
    usd: number;
    usd_24h_change: number;
}

interface WalletBalancesData {
    balances: TokenBalance[];
    totalValueUSD: number;
}

async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint> {
    const paddedAddress = walletAddress.slice(2).padStart(64, '0');
    const data = BALANCE_OF_SELECTOR + paddedAddress;

    const response = await fetch(ALCHEMY_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [{ to: tokenAddress, data }, 'latest']
        })
    });

    const result = await response.json();
    if (result.error) {
        console.error('RPC error:', result.error);
        return BigInt(0);
    }

    return BigInt(result.result || '0x0');
}

async function getTokenPrices(): Promise<Record<string, TokenPrice>> {
    const prices: Record<string, TokenPrice> = {};

    try {
        // 1. Fetch from DEX Screener for ALL World Chain tokens by address
        // This is now our PRIMARY source for accuracy on World Chain
        const allAddresses = WORLD_CHAIN_TOKENS.map(t => t.address).join(',');

        if (allAddresses) {
            const dexResponse = await fetch(
                `https://api.dexscreener.com/latest/dex/tokens/${allAddresses}`
            );

            if (dexResponse.ok) {
                const dexData = await dexResponse.json();
                if (dexData.pairs) {
                    WORLD_CHAIN_TOKENS.forEach(token => {
                        // Find the best pair for this token SPECIFICALLY on World Chain
                        const pairs = dexData.pairs.filter((p: any) =>
                            p.chainId === 'worldchain' &&
                            p.baseToken.address.toLowerCase() === token.address.toLowerCase()
                        );

                        if (pairs.length > 0) {
                            // Sort by liquidity to get the most reliable price
                            const bestPair = pairs.sort((a: any, b: any) =>
                                (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
                            )[0];

                            prices[token.symbol] = {
                                usd: parseFloat(bestPair.priceUsd || '0'),
                                usd_24h_change: bestPair.priceChange?.h24 || 0
                            };
                        }
                    });
                }
            }
        }

        // 2. Fallback to CoinGecko only for tokens missing from DEX Screener (if any)
        // or for those with established IDs where we want to cross-reference
        const missingSymbols = WORLD_CHAIN_TOKENS.filter(t => !prices[t.symbol]);
        const geckoIdsToFetch = missingSymbols
            .map(t => COINGECKO_IDS[t.symbol])
            .filter(Boolean)
            .join(',');

        if (geckoIdsToFetch) {
            const geckoResponse = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIdsToFetch}&vs_currencies=usd&include_24hr_change=true`
            );

            if (geckoResponse.ok) {
                const geckoData = await geckoResponse.json();
                missingSymbols.forEach(token => {
                    const geckoId = COINGECKO_IDS[token.symbol];
                    if (geckoId && geckoData[geckoId]) {
                        prices[token.symbol] = {
                            usd: geckoData[geckoId].usd || 0,
                            usd_24h_change: geckoData[geckoId].usd_24h_change || 0
                        };
                    }
                });
            }
        }

        return prices;
    } catch (error) {
        console.error('Failed to fetch prices from primary sources:', error);
        return prices;
    }
}

function formatBalance(balance: bigint, decimals: number): string {
    const divisor = BigInt(10 ** decimals);
    const integerPart = balance / divisor;
    const fractionalPart = balance % divisor;

    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const significantDecimals = Math.min(decimals, 6);
    const trimmedFractional = fractionalStr.slice(0, significantDecimals).replace(/0+$/, '') || '0';

    if (integerPart === BigInt(0) && balance > BigInt(0)) {
        return `0.${fractionalStr.slice(0, significantDecimals)}`;
    }

    return trimmedFractional === '0'
        ? integerPart.toString()
        : `${integerPart}.${trimmedFractional}`;
}

/** Fetch wallet balances from Alchemy + CoinGecko */
async function fetchWalletBalances(walletAddress: string): Promise<WalletBalancesData> {
    const [rawBalances, prices] = await Promise.all([
        Promise.all(
            WORLD_CHAIN_TOKENS.map(async (token) => {
                const balance = await getTokenBalance(token.address, walletAddress);
                return { token, balance };
            })
        ),
        getTokenPrices()
    ]);

    let total = 0;
    const tokenBalances: TokenBalance[] = rawBalances.map(({ token, balance }) => {
        const formattedBalance = formatBalance(balance, token.decimals);
        const price = prices[token.symbol]?.usd || 0;
        const change24h = prices[token.symbol]?.usd_24h_change || 0;
        const valueUSD = parseFloat(formattedBalance) * price;
        total += valueUSD;

        return {
            token,
            balance: formattedBalance,
            valueUSD,
            change24h
        };
    });

    // Sort: WLD first, then by value
    tokenBalances.sort((a, b) => {
        if (a.token.symbol === 'WLD') return -1;
        if (b.token.symbol === 'WLD') return 1;
        return b.valueUSD - a.valueUSD;
    });

    return { balances: tokenBalances, totalValueUSD: total };
}

/** Hook for fetching wallet balances with caching and auto-refresh */
export function useWalletBalances(walletAddress: string | null) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['walletBalances', walletAddress],
        queryFn: () => fetchWalletBalances(walletAddress!),
        staleTime: 30 * 1000,           // Fresh for 30 seconds
        gcTime: 5 * 60 * 1000,          // Keep in cache for 5 minutes
        refetchInterval: 30 * 1000,     // Auto-refetch every 30 seconds
        refetchOnWindowFocus: true,
        retry: 2,
        enabled: !!walletAddress
    });

    return {
        balances: data?.balances ?? [],
        isLoading,
        error: error?.message ?? null,
        totalValueUSD: data?.totalValueUSD ?? 0,
        refetch
    };
}
