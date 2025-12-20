"use client"

import { useQuery } from "@tanstack/react-query"
import type { TokenBalance } from "@/lib/types"
import { WORLD_CHAIN_TOKENS } from "@/lib/tokens"

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const ALCHEMY_RPC = `https://worldchain-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
const BALANCE_OF_SELECTOR = "0x70a08231"

const STABLECOIN_SYMBOLS = ["USDC", "USDT", "DAI", "USDC.e"]

interface TokenPrice {
    usd: number
    usd_24h_change: number
}

interface WalletBalancesData {
    balances: TokenBalance[]
    totalValueUSD: number
}

async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<bigint> {
    const paddedAddress = walletAddress.slice(2).padStart(64, "0")
    const data = BALANCE_OF_SELECTOR + paddedAddress

    const response = await fetch(ALCHEMY_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_call",
            params: [{ to: tokenAddress, data }, "latest"],
        }),
    })

    const result = await response.json()
    if (result.error) {
        console.error("RPC error:", result.error)
        return BigInt(0)
    }

    return BigInt(result.result || "0x0")
}

async function getTokenPrices(): Promise<Record<string, TokenPrice>> {
    const prices: Record<string, TokenPrice> = {}

    // Inicializar stablecoins con precio $1
    STABLECOIN_SYMBOLS.forEach((symbol) => {
        prices[symbol] = { usd: 1, usd_24h_change: 0 }
    })

    try {
        // Filtrar tokens que no son stablecoins para consultar DEX Screener
        const tokensToFetch = WORLD_CHAIN_TOKENS.filter((t) => !STABLECOIN_SYMBOLS.includes(t.symbol))

        if (tokensToFetch.length === 0) return prices

        const addresses = tokensToFetch.map((t) => t.address).join(",")

        const dexResponse = await fetch(`https://api.dexscreener.com/tokens/v1/worldchain/${addresses}`, {
            headers: { Accept: "application/json" },
        })

        if (!dexResponse.ok) {
            console.warn("DEX Screener API error:", dexResponse.status)
            return prices
        }

        const pairs = await dexResponse.json()

        if (!Array.isArray(pairs)) {
            console.warn("DEX Screener returned unexpected format")
            return prices
        }

        // Procesar cada token
        tokensToFetch.forEach((token) => {
            const tokenAddr = token.address.toLowerCase()

            const tokenPairs = pairs.filter((p: any) => p.baseToken?.address?.toLowerCase() === tokenAddr)

            if (tokenPairs.length > 0) {
                // Ordenar por liquidez para obtener el mejor precio
                const bestPair = tokenPairs.sort(
                    (a: any, b: any) => Number.parseFloat(b.liquidity?.usd || "0") - Number.parseFloat(a.liquidity?.usd || "0"),
                )[0]

                prices[token.symbol] = {
                    usd: Number.parseFloat(bestPair.priceUsd || "0"),
                    usd_24h_change: bestPair.priceChange?.h24 || 0,
                }
            } else {
                const quotePairs = pairs.filter((p: any) => p.quoteToken?.address?.toLowerCase() === tokenAddr)

                if (quotePairs.length > 0) {
                    const bestPair = quotePairs.sort(
                        (a: any, b: any) => Number.parseFloat(b.liquidity?.usd || "0") - Number.parseFloat(a.liquidity?.usd || "0"),
                    )[0]

                    const basePriceUsd = Number.parseFloat(bestPair.priceUsd || "0")
                    const priceNative = Number.parseFloat(bestPair.priceNative || "0")

                    if (priceNative > 0 && basePriceUsd > 0) {
                        prices[token.symbol] = {
                            usd: basePriceUsd / priceNative,
                            usd_24h_change: -(bestPair.priceChange?.h24 || 0),
                        }
                    }
                }
            }
        })

        return prices
    } catch (error) {
        console.error("Failed to fetch prices from DEX Screener:", error)
        return prices
    }
}

function formatBalance(balance: bigint, decimals: number): string {
    const divisor = BigInt(10 ** decimals)
    const integerPart = balance / divisor
    const fractionalPart = balance % divisor

    const fractionalStr = fractionalPart.toString().padStart(decimals, "0")
    const significantDecimals = Math.min(decimals, 6)
    const trimmedFractional = fractionalStr.slice(0, significantDecimals).replace(/0+$/, "") || "0"

    if (integerPart === BigInt(0) && balance > BigInt(0)) {
        return `0.${fractionalStr.slice(0, significantDecimals)}`
    }

    return trimmedFractional === "0" ? integerPart.toString() : `${integerPart}.${trimmedFractional}`
}

async function fetchWalletBalances(walletAddress: string): Promise<WalletBalancesData> {
    const [rawBalances, prices] = await Promise.all([
        Promise.all(
            WORLD_CHAIN_TOKENS.map(async (token) => {
                const balance = await getTokenBalance(token.address, walletAddress)
                return { token, balance }
            }),
        ),
        getTokenPrices(),
    ])

    let total = 0
    const tokenBalances: TokenBalance[] = rawBalances.map(({ token, balance }) => {
        const formattedBalance = formatBalance(balance, token.decimals)
        const price = prices[token.symbol]?.usd || 0
        const change24h = prices[token.symbol]?.usd_24h_change || 0
        const valueUSD = Number.parseFloat(formattedBalance) * price
        total += valueUSD

        return {
            token,
            balance: formattedBalance,
            valueUSD,
            change24h,
        }
    })

    tokenBalances.sort((a, b) => {
        if (a.token.symbol === "WLD") return -1
        if (b.token.symbol === "WLD") return 1
        return b.valueUSD - a.valueUSD
    })

    return { balances: tokenBalances, totalValueUSD: total }
}

export function useWalletBalances(walletAddress: string | null) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["walletBalances", walletAddress],
        queryFn: () => fetchWalletBalances(walletAddress!),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchInterval: 30 * 1000,
        refetchOnWindowFocus: true,
        retry: 2,
        enabled: !!walletAddress,
    })

    return {
        balances: data?.balances ?? [],
        isLoading,
        error: error?.message ?? null,
        totalValueUSD: data?.totalValueUSD ?? 0,
        refetch,
    }
}
