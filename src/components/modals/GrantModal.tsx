'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

interface GrantModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
}

interface GrantCycle {
    humanity_check_time: string | null;
    document_check_time: string | null;
    grant_cycle_start_date: string;
    grant_cycle_end_date: string;
}

export default function GrantModal({ isOpen, onClose, walletAddress }: GrantModalProps) {
    const { t } = useI18n();
    const [grantInfo, setGrantInfo] = useState<GrantCycle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = () => {
        setLoading(true);
        setError(false);
        setRetryCount(prev => prev + 1);
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchGrantInfo = async () => {
            if (!walletAddress) return;
            try {
                // Add timestamp to prevent caching
                const res = await fetch(`/api/grants?wallet_address=${walletAddress}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setGrantInfo(data);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error('Error fetching grant info', e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGrantInfo();
    }, [isOpen, walletAddress, retryCount]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">{t.grants.title}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3">
                                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-zinc-500">{t.grants.checking}</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <p className="text-white font-medium mb-1">{t.grants.unableToLoad}</p>
                                <p className="text-zinc-500 text-sm mb-6">{t.grants.fetchError}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-2.5 bg-zinc-800 text-white rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors"
                                    >
                                        {t.modals.close}
                                    </button>
                                    <button
                                        onClick={handleRetry}
                                        className="flex-1 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
                                    >
                                        {t.common.retry}
                                    </button>
                                </div>
                            </div>
                        ) : grantInfo && (
                            <GrantContent info={grantInfo} />
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function GrantContent({ info }: { info: GrantCycle }) {
    const { t } = useI18n();
    const now = new Date();
    const startDate = new Date(info.grant_cycle_start_date);
    const endDate = new Date(info.grant_cycle_end_date);
    const isAvailable = now >= startDate && now < endDate;

    const handleOpenWorldApp = () => {
        window.open('https://worldcoin.org', '_blank');
    };

    return (
        <div className="flex flex-col items-center text-center gap-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAvailable ? 'bg-green-500/20' : 'bg-zinc-800'}`}>
                <svg className={`w-8 h-8 ${isAvailable ? 'text-green-500' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-2">
                    {isAvailable ? t.grants.available : t.grants.next}
                </h3>
                <p className="text-zinc-400 text-sm">
                    {isAvailable
                        ? t.grants.readyToClaim
                        : `${t.grants.availableOn} ${startDate.toLocaleDateString()}`}
                </p>
            </div>

            {isAvailable ? (
                <button
                    onClick={handleOpenWorldApp}
                    className="w-full py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all"
                >
                    {t.grants.openApp}
                </button>
            ) : (
                <div className="w-full p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-zinc-500">{t.grants.starts}</span>
                        <span className="text-white">{startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500">{t.grants.ends}</span>
                        <span className="text-white">{endDate.toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
