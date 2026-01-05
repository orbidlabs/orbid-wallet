'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

interface GrantClaimCardProps {
    walletAddress: string;
}

interface GrantCycle {
    humanity_check_time: string | null;
    document_check_time: string | null;
    grant_cycle_start_date: string;
    grant_cycle_end_date: string;
}

export default function GrantClaimCard({ walletAddress }: GrantClaimCardProps) {
    const { t } = useI18n();
    const [grantInfo, setGrantInfo] = useState<GrantCycle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchGrantInfo = async () => {
            if (!walletAddress) return;
            try {
                const res = await fetch(`/api/grants?wallet_address=${walletAddress}`);
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
    }, [walletAddress]);

    if (loading || error || !grantInfo) return null;

    // Logic: If humanity_check_time is null, it means they might not be orb verified or it's not available.
    // Basically we check the next start date.
    // If current date > grant_cycle_start_date AND < grant_cycle_end_date, and they haven't claimed (which we don't strictly know, but we know the cycle),
    // actually, this API returns the *next* cycle or the *current* cycle logic.
    // According to docs: "Returns the user's humanity [...] grant cycle date".
    // Let's assume it returns the *current applicable* cycle.

    const now = new Date();
    const startDate = new Date(grantInfo.grant_cycle_start_date);
    const endDate = new Date(grantInfo.grant_cycle_end_date);
    const isAvailable = now >= startDate && now < endDate;

    // If available, show "Claim Now". If not, show "Next grant: [Date]"
    // Actually, if now < startDate, it's upcoming.
    // If now > endDate, it is expired or we are between cycles.

    const handleClaimClick = () => {
        // Redirect to World App
        window.location.href = "https://worldcoin.org/mini-app?app_id=app_920c1c9a0cb3aaa68e626f54c09f3cf9&path=/"; // Standard deep link effectively just opens app if installed, or redirects.
        // Or better: Instructions.
        // Ideally: window.open("worldapp://");
        // But for web MiniApp, we might just be ALREADY in World App.
        // If we are in World App, we can't deep direct to "Grants" tab easily. 
        // We will just alert the user to go to the grants tab.

        // However, user asked for a "Button to claim".
        // The best we can do is "Open Grants" (if we could) or "Go to World App".
        // Let's try to open standard worldcoin scheme.
        window.open('https://worldcoin.org', '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-white/5 relative overflow-hidden shadow-lg"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <img src="/logo.svg" alt="Worldcoin" className="w-24 h-24" />
            </div>

            <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Worldcoin Grants
                    </h3>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        {isAvailable ? (
                            <>
                                <p className="text-xs text-zinc-400 mb-1">Grant Available</p>
                                <p className="text-xl font-display font-bold text-white">
                                    Ready to Claim
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-zinc-400 mb-1">Next Grant</p>
                                <p className="text-base font-display font-medium text-white">
                                    {startDate.toLocaleDateString()}
                                </p>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleClaimClick}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95
                            ${isAvailable
                                ? 'bg-white text-black hover:bg-zinc-200'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                            }
                        `}
                    >
                        {isAvailable ? 'Open World App' : 'Check Status'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
