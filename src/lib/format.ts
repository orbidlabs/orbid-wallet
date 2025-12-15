'use client';

/**
 * Format price for display, handling very small values like meme tokens
 * @param price - The price value
 * @param isUSD - Whether to add $ prefix (default true)
 * @returns Formatted price string
 */
export function formatPrice(price: number, isUSD = true): string {
    const prefix = isUSD ? '$' : '';

    if (price === 0) return `${prefix}0.00`;

    const absPrice = Math.abs(price);

    // Large values: $1,234.56
    if (absPrice >= 1) {
        return `${prefix}${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Medium values: $0.1234
    if (absPrice >= 0.0001) {
        return `${prefix}${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        })}`;
    }

    // Small values: $0.000012
    if (absPrice >= 0.000001) {
        return `${prefix}${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })}`;
    }

    // Very small values: $0.00000123 or scientific notation
    if (absPrice >= 0.00000001) {
        return `${prefix}${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        })}`;
    }

    // Extremely small: use subscript notation like $0.0₅123
    // Count leading zeros after decimal
    const str = absPrice.toFixed(20);
    const match = str.match(/^0\.0*([1-9])/);
    if (match) {
        const leadingZeros = str.indexOf(match[1]) - 2; // -2 for "0."
        const significantDigits = absPrice.toFixed(leadingZeros + 4).slice(-4);
        return `${prefix}0.0${subscript(leadingZeros)}${significantDigits}`;
    }

    // Fallback
    return `${prefix}${price.toExponential(2)}`;
}

/**
 * Format token value (balance * price)
 * Uses smarter formatting for very small amounts
 */
export function formatTokenValue(value: number): string {
    if (value === 0) return '$0.00';

    const absValue = Math.abs(value);

    // Large values: $1,234.56
    if (absValue >= 1) {
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Small values: show more decimals
    if (absValue >= 0.01) {
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        })}`;
    }

    // Very small values: show up to 6 decimals
    if (absValue >= 0.0001) {
        return `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })}`;
    }

    // Tiny values: show < $0.0001
    return '<$0.0001';
}

/** Convert number to subscript unicode */
function subscript(n: number): string {
    const subscripts = '₀₁₂₃₄₅₆₇₈₉';
    return n.toString().split('').map(d => subscripts[parseInt(d)]).join('');
}
