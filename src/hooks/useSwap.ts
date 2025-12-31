'use client';

import { useState, useCallback } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { SWAP_CONFIG, ORBID_SWAP_RELAY_ADDRESS, UNISWAP_ADDRESSES } from '@/lib/uniswap/config';
import type { Token, SwapQuote, SwapState } from '@/lib/uniswap/types';

// Contract ABI for OrbIdSwapRelay.swap function
const SWAP_ABI = [{
    name: 'swap',
    type: 'function',
    inputs: [{
        name: 'params',
        type: 'tuple',
        components: [
            { name: 'tokenIn', type: 'address' },
            { name: 'tokenOut', type: 'address' },
            { name: 'amountIn', type: 'uint256' },
            { name: 'amountOutMin', type: 'uint256' },
            { name: 'poolFee', type: 'uint24' },
            { name: 'deadline', type: 'uint256' },
            { name: 'version', type: 'uint8' } // SwapVersion enum: 0=V2, 1=V3, 2=V4
        ]
    }],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable'
}] as const;

// ERC20 approve ABI
const ERC20_APPROVE_ABI = [{
    name: 'approve',
    type: 'function',
    inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable'
}] as const;

interface UseSwapParams {
    tokenIn: Token | null;
    tokenOut: Token | null;
    quote: SwapQuote | null;
    walletAddress: string;
    slippageBps?: number;
}

interface UseSwapResult {
    state: SwapState;
    executeSwap: () => Promise<void>;
    reset: () => void;
}

/**
 * Convert route version string to contract enum value
 */
function getVersionEnum(version: 'v2' | 'v3' | 'v4'): 0 | 1 | 2 {
    switch (version) {
        case 'v2': return 0;
        case 'v3': return 1;
        case 'v4': return 2;
    }
}

/**
 * Hook for executing swaps through OrbIdSwapRelay via MiniKit
 */
export function useSwap({
    tokenIn,
    tokenOut,
    quote,
    walletAddress,
    slippageBps = SWAP_CONFIG.DEFAULT_SLIPPAGE_BPS,
}: UseSwapParams): UseSwapResult {
    const [state, setState] = useState<SwapState>({
        status: 'idle',
        quote: null,
        txHash: null,
        error: null,
    });

    const reset = useCallback(() => {
        setState({
            status: 'idle',
            quote: null,
            txHash: null,
            error: null,
        });
    }, []);

    const executeSwap = useCallback(async () => {
        if (!tokenIn || !tokenOut || !quote || !walletAddress) {
            setState(s => ({ ...s, status: 'error', error: 'Missing parameters' }));
            return;
        }

        if (!ORBID_SWAP_RELAY_ADDRESS) {
            setState(s => ({ ...s, status: 'error', error: 'Swap relay not deployed' }));
            return;
        }

        if (!MiniKit.isInstalled()) {
            setState(s => ({ ...s, status: 'error', error: 'Please open in World App' }));
            return;
        }

        try {
            setState(s => ({ ...s, status: 'approving', quote }));

            // Step 1: Approve OrbIdSwapRelay to spend tokens
            const amountInStr = quote.amountIn.toString();

            const approvalResult = await MiniKit.commandsAsync.sendTransaction({
                transaction: [{
                    address: tokenIn.address as `0x${string}`,
                    abi: ERC20_APPROVE_ABI,
                    functionName: 'approve',
                    args: [ORBID_SWAP_RELAY_ADDRESS, amountInStr]
                }]
            });

            if (approvalResult.finalPayload.status !== 'success') {
                throw new Error('Approval failed');
            }

            // Wait a moment for approval to be processed
            await new Promise(resolve => setTimeout(resolve, 2000));

            setState(s => ({ ...s, status: 'swapping' }));

            // Step 2: Execute swap
            const deadline = Math.floor(Date.now() / 1000) + (SWAP_CONFIG.DEFAULT_DEADLINE_MINUTES * 60);
            const version = getVersionEnum(quote.route.version);
            const poolFee = quote.route.pools[0]?.fee || SWAP_CONFIG.FEE_TIERS.MEDIUM;

            const swapResult = await MiniKit.commandsAsync.sendTransaction({
                transaction: [{
                    address: ORBID_SWAP_RELAY_ADDRESS as `0x${string}`,
                    abi: SWAP_ABI,
                    functionName: 'swap',
                    args: [[
                        tokenIn.address,
                        tokenOut.address,
                        amountInStr,
                        quote.amountOutMin.toString(),
                        poolFee,
                        deadline.toString(),
                        version
                    ]]
                }]
            });

            const finalPayload = swapResult.finalPayload;

            if (finalPayload.status === 'success') {
                const txHash = finalPayload.transaction_id || '';
                setState({
                    status: 'success',
                    quote,
                    txHash,
                    error: null,
                });
            } else {
                const errorCode = (finalPayload as { error_code?: string }).error_code || 'unknown';
                throw new Error(`Swap failed: ${errorCode}`);
            }

        } catch (error) {
            console.error('Swap failed:', error);
            setState({
                status: 'error',
                quote,
                txHash: null,
                error: error instanceof Error ? error.message : 'Swap failed',
            });
        }
    }, [tokenIn, tokenOut, quote, walletAddress, slippageBps]);

    return {
        state,
        executeSwap,
        reset,
    };
}
