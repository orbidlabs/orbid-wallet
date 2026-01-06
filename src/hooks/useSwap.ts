'use client';

import { useState, useCallback } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { encodeAbiParameters, parseAbiParameters, type Hex } from 'viem';
import { SWAP_CONFIG, UNISWAP_ADDRESSES } from '@/lib/uniswap/config';
import type { Token, SwapQuote, SwapState } from '@/lib/uniswap/types';

const UNIVERSAL_ROUTER_ABI = [{
    name: 'execute',
    type: 'function',
    inputs: [
        { name: 'commands', type: 'bytes' },
        { name: 'inputs', type: 'bytes[]' },
        { name: 'deadline', type: 'uint256' }
    ],
    outputs: [],
    stateMutability: 'payable'
}] as const;

interface UseSwapParams {
    tokenIn: Token | null;
    tokenOut: Token | null;
    quote: SwapQuote | null;
    walletAddress: string;
}

interface UseSwapResult {
    state: SwapState;
    executeSwap: () => Promise<void>;
    reset: () => void;
}

function encodePathV3(tokenIn: string, fee: number, tokenOut: string): Hex {
    return (tokenIn.toLowerCase() +
        fee.toString(16).padStart(6, '0') +
        tokenOut.toLowerCase().slice(2)) as Hex;
}

export function useSwap({
    tokenIn,
    tokenOut,
    quote,
    walletAddress,
}: UseSwapParams): UseSwapResult {
    const [state, setState] = useState<SwapState>({
        status: 'idle',
        quote: null,
        txHash: null,
        error: null,
    });

    const reset = useCallback(() => {
        setState({ status: 'idle', quote: null, txHash: null, error: null });
    }, []);

    const executeSwap = useCallback(async () => {
        if (!tokenIn || !tokenOut || !quote || !walletAddress) {
            setState(s => ({ ...s, status: 'error', error: 'Missing parameters' }));
            return;
        }

        if (!MiniKit.isInstalled()) {
            setState(s => ({ ...s, status: 'error', error: 'Please open in World App' }));
            return;
        }

        let version: 'v2' | 'v3' | 'v4' | undefined;
        let amountIn: string | undefined;

        try {
            setState(s => ({ ...s, status: 'swapping', quote }));

            amountIn = quote.amountIn.toString();
            const amountOutMin = quote.amountOutMin.toString();
            const deadline = BigInt(Math.floor(Date.now() / 1000) + (SWAP_CONFIG.DEFAULT_DEADLINE_MINUTES * 60));
            const poolFee = quote.route.pools[0]?.fee || SWAP_CONFIG.FEE_TIERS.MEDIUM;
            version = quote.route.version;
            const router = UNISWAP_ADDRESSES.UNIVERSAL_ROUTER;
            const tokenInLower = tokenIn.address.toLowerCase() as `0x${string}`;
            const nonce = Date.now().toString();

            let command: Hex;
            let encodedInput: Hex;

            if (version === 'v3') {
                command = '0x00'; // V3_SWAP_EXACT_IN
                const path = encodePathV3(tokenIn.address, poolFee, tokenOut.address);
                encodedInput = encodeAbiParameters(
                    parseAbiParameters('address, uint256, uint256, bytes, bool'),
                    [walletAddress as `0x${string}`, BigInt(amountIn), BigInt(amountOutMin), path, true]
                );
            } else {
                command = '0x08'; // V2_SWAP_EXACT_IN
                encodedInput = encodeAbiParameters(
                    parseAbiParameters('address, uint256, uint256, address[], bool'),
                    [walletAddress as `0x${string}`, BigInt(amountIn), BigInt(amountOutMin), [tokenIn.address as Hex, tokenOut.address as Hex], true]
                );
            }

            console.log('Executing Universal Router Swap:', {
                version,
                router,
                method: 'execute',
                command,
                encodedInput
            });

            const result = await MiniKit.commandsAsync.sendTransaction({
                transaction: [{
                    address: router as `0x${string}`,
                    abi: UNIVERSAL_ROUTER_ABI,
                    functionName: 'execute',
                    args: [command, [encodedInput], deadline]
                }],
                permit2: [{
                    permitted: { token: tokenInLower, amount: amountIn },
                    spender: router as `0x${string}`,
                    nonce,
                    deadline: deadline.toString(),
                }]
            });

            if (!result) {
                throw new Error('Transaction request failed');
            }

            if (result.finalPayload.status === 'success') {
                setState({
                    status: 'success',
                    quote,
                    txHash: result.finalPayload.transaction_id || '',
                    error: null,
                });
            } else {
                const error = JSON.stringify(result.finalPayload, null, 2);
                throw new Error(error);
            }

        } catch (error) {
            console.error('Swap failed:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            const context = JSON.stringify({
                version,
                router: UNISWAP_ADDRESSES.UNIVERSAL_ROUTER,
                tokenIn: tokenIn.address,
                tokenOut: tokenOut.address,
                amountIn,
                method: 'execute',
                isMiniKitInstalled: MiniKit.isInstalled()
            }, null, 2);

            setState({
                status: 'error',
                quote,
                txHash: null,
                error: `Error: ${errorMessage}\n\nContext:\n${context}`,
            });
        }
    }, [tokenIn, tokenOut, quote, walletAddress]);

    return { state, executeSwap, reset };
}
