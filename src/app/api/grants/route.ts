
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet_address');
    const appId = 'app_920c1c9a0cb3aaa68e626f54c09f3cf9';
    // Access the API key from environment variables
    const apiKey = process.env.WORLD_APP_API_KEY;

    if (!walletAddress) {
        return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    if (!apiKey) {
        // If no API key is configured, we can't make the call.
        // Return a mock response or error.
        console.error('Missing WORLD_APP_API_KEY environment variable');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `https://developer.worldcoin.org/api/v2/minikit/user-grant-cycle?wallet_address=${walletAddress}&app_id=${appId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching grant cycle:', response.status, errorText);
            return NextResponse.json({ error: `Failed to fetch grant cycle: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Server error fetching grant cycle:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
