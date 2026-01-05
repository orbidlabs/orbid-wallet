
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet_address');
    const appId = 'app_920c1c9a0cb3aaa68e626f54c09f3cf9'; // OrbId App ID

    if (!walletAddress) {
        return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://developer.worldcoin.org/api/v2/minikit/user-grant-cycle?wallet_address=${walletAddress}&app_id=${appId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Error fetching grant cycle:', error);
            return NextResponse.json({ error: 'Failed to fetch grant cycle' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server error fetching grant cycle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
