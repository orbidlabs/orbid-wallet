import { NextRequest, NextResponse } from 'next/server';

interface Localisation {
    language: string;
    title: string;
    message: string;
}

interface SendNotificationRequest {
    walletAddresses: string[];
    localisations: Localisation[];
    miniAppPath?: string;
}

export async function POST(request: NextRequest) {
    try {
        // Validate admin authorization
        const auth = request.headers.get('Authorization');
        if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: SendNotificationRequest = await request.json();
        const { walletAddresses, localisations, miniAppPath = '/' } = body;

        // Validate inputs
        if (!walletAddresses || walletAddresses.length === 0) {
            return NextResponse.json({ error: 'walletAddresses required' }, { status: 400 });
        }

        if (walletAddresses.length > 1000) {
            return NextResponse.json({ error: 'Maximum 1000 addresses per request' }, { status: 400 });
        }

        if (!localisations || localisations.length === 0) {
            return NextResponse.json({ error: 'At least one localisation required' }, { status: 400 });
        }

        // Validate English is included
        const hasEnglish = localisations.some(l => l.language === 'en');
        if (!hasEnglish) {
            return NextResponse.json({ error: 'English localisation is required' }, { status: 400 });
        }

        // Get env vars
        const apiKey = process.env.WORLD_APP_API_KEY;
        const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID;

        if (!apiKey) {
            console.error('WORLD_APP_API_KEY not configured');
            return NextResponse.json({ error: 'WORLD_APP_API_KEY not configured' }, { status: 500 });
        }

        if (!appId) {
            console.error('NEXT_PUBLIC_WORLD_APP_ID not configured');
            return NextResponse.json({ error: 'NEXT_PUBLIC_WORLD_APP_ID not configured' }, { status: 500 });
        }

        // Build the deep link path
        const deepLinkPath = miniAppPath === '/'
            ? `worldapp://mini-app?app_id=${appId}`
            : `worldapp://mini-app?app_id=${appId}&path=${encodeURIComponent(miniAppPath)}`;

        // Send to World App API
        const response = await fetch('https://developer.worldcoin.org/api/v2/minikit/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                app_id: appId,
                wallet_addresses: walletAddresses,
                localisations: localisations.map(l => ({
                    language: l.language,
                    title: l.title,
                    message: l.message,
                })),
                mini_app_path: deepLinkPath,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('World App API error:', response.status, data);
            return NextResponse.json(
                { error: 'Failed to send notification', details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Admin notification send error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
