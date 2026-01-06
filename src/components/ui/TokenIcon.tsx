'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TokenIconProps {
    symbol: string;
    name: string;
    logoURI?: string;
    size?: number;
    className?: string;
}

export default function TokenIcon({ symbol, name, logoURI, size = 36, className = "" }: TokenIconProps) {
    const [error, setError] = useState(false);

    const fallback = (
        <div
            className={`flex items-center justify-center bg-zinc-800 text-zinc-400 font-bold uppercase rounded-full ${className}`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {symbol.slice(0, 1)}
        </div>
    );

    if (!logoURI || error) {
        return fallback;
    }

    return (
        <div className={`relative rounded-full overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
            <Image
                src={logoURI}
                alt={name}
                fill
                sizes={`${size}px`}
                className="object-cover"
                onError={() => setError(true)}
                unoptimized
            />
        </div>
    );
}
