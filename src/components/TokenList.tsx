'use client';

import { useMemo, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { TokenBalance } from '@/lib/types';
import TokenIcon from './ui/TokenIcon';
import AdCarousel from './AdCarousel';
import { Pressable, StaggerContainer, StaggerItem, FadeIn } from './ui/Motion';
import { useI18n } from '@/lib/i18n';

const TokenItem = memo(function TokenItem({
    item,
    onClick
}: {
    item: TokenBalance;
    onClick: () => void;
}) {
    return (
        <StaggerItem>
            <Pressable
                onClick={onClick}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
                <div className="flex items-center gap-3">
                    <TokenIcon
                        symbol={item.token.symbol}
                        name={item.token.name}
                        logoURI={item.token.logoURI}
                        size={36}
                    />
                    <div>
                        <p className="font-medium text-white text-sm">{item.token.symbol}</p>
                        <p className="text-xs text-zinc-500">{item.token.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-medium text-white text-sm">{parseFloat(item.balance).toFixed(4)}</p>
                    <div className="flex items-center justify-end gap-1.5">
                        <span className="text-xs text-zinc-500">
                            ${item.valueUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </Pressable>
        </StaggerItem>
    );
});

interface TokenListProps {
    balances: TokenBalance[];
    isLoading?: boolean;
    onTokenClick?: (tokenBalance: TokenBalance) => void;
    onSend?: () => void;
    onReceive?: () => void;
    onBuy?: () => void;
    onGrant?: () => void;
}

function TokenListComponent({ balances, isLoading, onTokenClick, onSend, onReceive, onBuy, onGrant }: TokenListProps) {
    const { t } = useI18n();
    const sortedBalances = useMemo(() =>
        [...balances].sort((a, b) => {
            if (a.token.symbol === 'WLD') return -1;
            if (b.token.symbol === 'WLD') return 1;
            return b.valueUSD - a.valueUSD;
        }),
        [balances]
    );

    const LoadingSkeleton = () => (
        <div className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse" />
                        <div>
                            <div className="w-12 h-4 bg-zinc-800 rounded animate-pulse mb-1" />
                            <div className="w-20 h-3 bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="w-16 h-4 bg-zinc-800 rounded animate-pulse mb-1" />
                        <div className="w-12 h-3 bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            <FadeIn>
                <div className="grid grid-cols-4 gap-2">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSend}
                        className="flex flex-col items-center gap-1.5 py-3 glass rounded-2xl group w-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center group-hover:bg-pink-500/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </motion.div>
                        <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 font-medium truncate w-full text-center px-1">{t.tokens.send}</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onReceive}
                        className="flex flex-col items-center gap-1.5 py-3 glass rounded-2xl group w-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                        </motion.div>
                        <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 font-medium truncate w-full text-center px-1">{t.tokens.receive}</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBuy}
                        className="flex flex-col items-center gap-1.5 py-3 glass rounded-2xl group w-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </motion.div>
                        <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 font-medium truncate w-full text-center px-1">{t.tokens.buy}</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGrant}
                        className="flex flex-col items-center gap-1.5 py-3 glass rounded-2xl group w-full"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 138 138">
                                <path d="M103.596 9.22563C93.0251 3.07522 81.4931 0 69 0C56.507 0 44.9749 3.07522 34.4039 9.22563C23.8329 15.3761 15.3761 23.8329 9.22563 34.4039C3.07522 44.9749 0 56.507 0 69C0 81.493 3.07522 93.0251 9.22563 103.596C15.3761 114.167 23.8329 122.624 34.4039 128.774C44.9749 134.925 56.507 138 69 138C81.4931 138 93.0251 134.925 103.596 128.774C114.167 122.624 122.624 114.167 128.774 103.596C134.925 93.0251 138 81.493 138 69C138 56.507 134.925 44.9749 128.774 34.4039C122.624 23.8329 114.167 15.3761 103.596 9.22563ZM73.2284 93.9861C65.3482 93.9861 59.1978 91.6797 54.3928 87.2591C51.1253 84.1838 49.0112 80.5321 48.0502 76.1114H122.624C121.855 82.4541 119.933 88.4123 117.242 93.9861H73.4206H73.2284ZM48.0502 62.0808C49.0112 57.8524 51.1253 54.0084 54.3928 50.9332C59.1978 46.5125 65.3482 44.2061 73.2284 44.2061H117.242C120.125 49.78 121.855 55.7382 122.624 62.0808H48.0502ZM22.2953 41.5153C27.1003 33.2507 33.6351 26.5237 41.8997 21.7187C50.1643 16.9137 59.1978 14.415 69.1922 14.415C79.1867 14.415 88.2201 16.9137 96.4847 21.7187C100.713 24.2173 104.365 27.1003 107.825 30.5599H73.0362C65.156 30.5599 58.0446 32.2897 51.8942 35.5571C45.7438 38.8245 40.9387 43.4373 37.6713 49.2034C35.3649 53.2396 33.8273 57.6602 33.0585 62.273H15.9527C16.7215 54.9694 19.0279 48.0501 22.6797 41.7075L22.2953 41.5153ZM96.2925 116.281C88.0279 121.086 78.9944 123.585 69 123.585C59.0056 123.585 49.9722 121.086 41.7075 116.281C33.4429 111.476 26.9081 104.749 22.1031 96.4847C18.4513 90.1421 16.1448 83.4151 15.376 76.1114H32.4819C33.2507 80.7243 34.7883 85.1448 37.0947 89.1811C40.5543 94.9471 45.3593 99.3677 51.3176 102.827C57.468 106.095 64.5794 107.825 72.4596 107.825H107.056C103.788 111.092 100.137 113.975 96.1003 116.281H96.2925Z" />
                            </svg>
                        </motion.div>
                        <span className="text-[10px] sm:text-xs text-zinc-400 group-hover:text-zinc-300 font-medium truncate w-full text-center px-1">Grant</span>
                    </motion.button>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <AdCarousel />
            </FadeIn>

            <FadeIn delay={0.15}>
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-white/5">
                        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{t.tokens.title}</h3>
                    </div>
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <StaggerContainer className="divide-y divide-white/5">
                            {sortedBalances.map((item) => (
                                <TokenItem
                                    key={item.token.symbol}
                                    item={item}
                                    onClick={() => onTokenClick?.(item)}
                                />
                            ))}
                        </StaggerContainer>
                    )}
                </div>
            </FadeIn>
        </div>
    );
}

export default memo(TokenListComponent);
