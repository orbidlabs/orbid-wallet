'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WORLD_CHAIN_TOKENS } from '@/lib/tokens';
import type { Transaction, TransactionStatus } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

// Alchemy API Key from environment
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';
const ALCHEMY_URL = `https://worldchain-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

interface AlchemyTransfer {
    blockNum: string;
    hash: string;
    from: string;
    to: string;
    value: number;
    asset: string;
    category: string;
    rawContract: {
        address: string;
        decimal: string;
    };
}

interface AlchemyResponse {
    result?: {
        transfers: AlchemyTransfer[];
        pageKey?: string;
    };
}

const TRANSACTIONS_PER_PAGE = 10;

// Find token info by address
function getTokenByAddress(address: string) {
    if (!address) return null;
    return WORLD_CHAIN_TOKENS.find(
        t => t.address.toLowerCase() === address.toLowerCase()
    );
}

export function useTransactionHistory(walletAddress?: string) {
    const { t } = useI18n();

    const getRelativeTime = useCallback((timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return t.relativeTime.justNow;
        if (minutes < 60) return t.relativeTime.minutesAgo.replace('%s', minutes.toString());
        if (hours < 24) return t.relativeTime.hoursAgo.replace('%s', hours.toString());
        if (days < 7) return t.relativeTime.daysAgo.replace('%s', days.toString());

        return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }, [t]);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Store page keys for pagination
    const pageKeysRef = useRef<{ sent?: string; received?: string }>({});
    const allTransactionsRef = useRef<Transaction[]>([]);

    const fetchTransactions = useCallback(async (isLoadMore: boolean = false) => {
        if (!walletAddress || !ALCHEMY_API_KEY) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        if (isLoadMore) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            pageKeysRef.current = {};
            allTransactionsRef.current = [];
        }
        setError(null);

        try {
            // Prepare common params
            const commonParams = {
                category: ['erc20', 'external'],
                order: 'desc',
                maxCount: `0x${TRANSACTIONS_PER_PAGE.toString(16)}`,
                excludeZeroValue: true
            };

            const sentParams: Record<string, unknown> = {
                ...commonParams,
                fromAddress: walletAddress.toLowerCase(),
            };
            const receivedParams: Record<string, unknown> = {
                ...commonParams,
                toAddress: walletAddress.toLowerCase(),
            };

            const promises: Promise<Response>[] = [];
            const requestTypes: ('sent' | 'received')[] = [];

            // Only fetch 'sent' if we have a pageKey OR it's the initial load
            if (!isLoadMore || pageKeysRef.current.sent !== undefined) {
                if (isLoadMore && pageKeysRef.current.sent) {
                    sentParams.pageKey = pageKeysRef.current.sent;
                }
                // If isLoadMore is true but sent key is null (undefined check passed?), wait.
                // The pageKey from Alchemy is 'undefined' if no more pages.
                // So if pageKeysRef.current.sent is undefined, we shouldn't fetch.
                // My check above: (!isLoadMore || pageKeysRef.current.sent !== undefined)
                // If isLoadMore=true, we need pageKeysRef.current.sent !== undefined.
                // This seems correct assuming we initialize ref to {} (undefined properties).
                // Wait, initial load: ref is {}. sent is undefined. !isLoadMore is true. We fetch. Correct.
                // Load more: send is undefined (exhausted). !isLoadMore is false. undefined!==undefined is false. We SKIP. Correct.

                requestTypes.push('sent');
                promises.push(
                    fetch(ALCHEMY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'alchemy_getAssetTransfers',
                            params: [sentParams]
                        })
                    })
                );
            }

            // Only fetch 'received' if we have a pageKey OR it's the initial load
            if (!isLoadMore || pageKeysRef.current.received !== undefined) {
                if (isLoadMore && pageKeysRef.current.received) {
                    receivedParams.pageKey = pageKeysRef.current.received;
                }
                requestTypes.push('received');
                promises.push(
                    fetch(ALCHEMY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            id: 2,
                            method: 'alchemy_getAssetTransfers',
                            params: [receivedParams]
                        })
                    })
                );
            }

            if (promises.length === 0) {
                setIsLoadingMore(false);
                setHasMore(false);
                return;
            }

            const responses = await Promise.all(promises);
            const jsonData = await Promise.all(responses.map(r => r.json()));

            let sentData: AlchemyResponse = {};
            let receivedData: AlchemyResponse = {};

            jsonData.forEach((data, index) => {
                if (requestTypes[index] === 'sent') sentData = data;
                else receivedData = data;
            });

            const sentTransfers: AlchemyTransfer[] = sentData.result?.transfers || [];
            const receivedTransfers: AlchemyTransfer[] = receivedData.result?.transfers || [];

            pageKeysRef.current = {
                sent: sentData.result?.pageKey,
                received: receivedData.result?.pageKey
            };

            const hasMorePages = !!(sentData.result?.pageKey || receivedData.result?.pageKey);
            setHasMore(hasMorePages);

            const allBlocks = [...new Set([
                ...sentTransfers.map(t => t.blockNum),
                ...receivedTransfers.map(t => t.blockNum)
            ])];

            const blockTimestamps: Record<string, number> = {};

            await Promise.all(
                allBlocks.map(async (blockNum) => {
                    try {
                        const res = await fetch(ALCHEMY_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                jsonrpc: '2.0',
                                id: 1,
                                method: 'eth_getBlockByNumber',
                                params: [blockNum, false]
                            })
                        });
                        const data = await res.json();
                        if (data.result?.timestamp) {
                            blockTimestamps[blockNum] = parseInt(data.result.timestamp, 16) * 1000;
                        }
                    } catch {
                        blockTimestamps[blockNum] = Date.now();
                    }
                })
            );

            const sentTxs: Transaction[] = sentTransfers.map(tx => {
                const token = getTokenByAddress(tx.rawContract?.address);
                return {
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value?.toString() || '0',
                    timestamp: blockTimestamps[tx.blockNum] || Date.now(),
                    blockNumber: tx.blockNum,
                    type: 'send' as const,
                    status: 'confirmed' as const,
                    tokenSymbol: token?.symbol || tx.asset || 'ETH',
                    tokenAmount: tx.value?.toString() || '0'
                };
            });

            const receivedTxs: Transaction[] = receivedTransfers.map(tx => {
                const token = getTokenByAddress(tx.rawContract?.address);
                return {
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value?.toString() || '0',
                    timestamp: blockTimestamps[tx.blockNum] || Date.now(),
                    blockNumber: tx.blockNum,
                    type: 'receive' as const,
                    status: 'confirmed' as const,
                    tokenSymbol: token?.symbol || tx.asset || 'ETH',
                    tokenAmount: tx.value?.toString() || '0'
                };
            });

            const newTxs = [...sentTxs, ...receivedTxs].sort((a, b) => b.timestamp - a.timestamp);

            if (isLoadMore) {
                // Filter out any transactions that we already have
                const existingHashes = new Set(allTransactionsRef.current.map(t => t.hash));
                const uniqueNewTxs = newTxs.filter(tx => !existingHashes.has(tx.hash));

                // If we fetched data but found no *new* transactions (e.g. overlap),
                // we should still respect the sort order of the combined list.
                const combined = [...allTransactionsRef.current, ...uniqueNewTxs];

                // Always re-sort to ensure correct order after merging pagination results
                combined.sort((a, b) => b.timestamp - a.timestamp);

                allTransactionsRef.current = combined;
            } else {
                // Initial load
                // Deduplicate within the fetched batch just in case
                allTransactionsRef.current = newTxs.filter((tx, index, self) =>
                    index === self.findIndex(t => t.hash === tx.hash)
                );
            }

            setTransactions([...allTransactionsRef.current]);

        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [walletAddress]);

    const loadMore = useCallback(() => {
        fetchTransactions(true);
    }, [fetchTransactions]);

    const refetch = useCallback(() => {
        fetchTransactions(false);
    }, [fetchTransactions]);

    useEffect(() => {
        fetchTransactions(false);
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
        refetch,
        getRelativeTime
    };
}
