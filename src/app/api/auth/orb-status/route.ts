'use server';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// GET: Check ONLY Orb verification status for a wallet
// This is separate from session auth - Orb verification persists forever
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
        return NextResponse.json({ isVerifiedHuman: false }, { status: 400 });
    }

    try {
        const supabase = getSupabaseAdmin();

        const { data: user } = await supabase
            .from('analytics_users')
            .select('is_orb_verified')
            .eq('wallet_address', walletAddress.toLowerCase())
            .single();

        return NextResponse.json({
            isVerifiedHuman: user?.is_orb_verified || false
        });
    } catch (error) {
        console.error('[Orb Status API] Error:', error);
        return NextResponse.json({ isVerifiedHuman: false });
    }
}
