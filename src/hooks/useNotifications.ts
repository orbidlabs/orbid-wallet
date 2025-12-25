'use client';

import { useState, useEffect, useCallback } from 'react';
import { MiniKit, Permission } from '@worldcoin/minikit-js';
import { useMiniKit } from '@/components/Providers';

interface NotificationState {
    isEnabled: boolean;
    isSupported: boolean;
    isLoading: boolean;
}

export function useNotifications() {
    const { isReady: miniKitReady, isInstalled } = useMiniKit();
    const [state, setState] = useState<NotificationState>({
        isEnabled: false,
        isSupported: false,
        isLoading: true,
    });

    // Sync function to update state based on MiniKit and storage
    const syncStatus = useCallback(() => {
        if (!miniKitReady) return;

        // Load saved preference from localStorage
        const savedPreference = localStorage.getItem('notifications_enabled');

        // Priority 1: Check MiniKit user state if available
        // Priority 2: Check localStorage
        const isEnabled = ((MiniKit.user as any)?.notificationsEnabled === true) || (savedPreference === 'true');

        setState({
            isEnabled: isEnabled && isInstalled,
            isSupported: isInstalled,
            isLoading: false,
        });
    }, [miniKitReady, isInstalled]);

    // Initial sync
    useEffect(() => {
        syncStatus();
    }, [syncStatus]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        // Fallback check if state is lagging
        const supported = isInstalled || MiniKit.isInstalled();
        if (!supported) {
            console.warn('MiniKit not installed, notifications not supported');
            return false;
        }

        setState(prev => ({ ...prev, isLoading: true }));

        try {
            console.log('[useNotifications] Requesting permission...');

            // Request notification permission via MiniKit
            const { finalPayload } = await MiniKit.commandsAsync.requestPermission({
                permission: Permission.Notifications
            });

            console.log('[useNotifications] requestPermission result:', finalPayload);

            const granted = finalPayload.status === 'success';

            // Save preference to localStorage as backup
            localStorage.setItem('notifications_enabled', granted ? 'true' : 'false');

            setState(prev => ({
                ...prev,
                isEnabled: granted,
                isLoading: false,
            }));

            return granted;
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            setState(prev => ({ ...prev, isLoading: false }));
            return false;
        }
    }, [isInstalled]);

    const disableNotifications = useCallback(() => {
        localStorage.setItem('notifications_enabled', 'false');
        setState(prev => ({ ...prev, isEnabled: false }));
    }, []);

    return {
        ...state,
        requestPermission,
        disableNotifications,
        syncStatus, // Expose sync function to allow manual refresh
    };
}
