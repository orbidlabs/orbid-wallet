# Uniswap Pool Database (Chain 480)

This directory contains the database of verified pools for **World Chain (Mainnet)**. The system uses these JSON files to discover pools and obtain accurate quotes.

## File Structure

Files are organized by Uniswap protocol version under the `chain/480/` folder:

- `v2-pools.json`: Uniswap V2 pools (Standard XYK).
- `v3-pools.json`: Uniswap V3 pools (Concentrated Liquidity).
- `v4-pools.json`: Uniswap V4 pools (Hooks & Singleton).

## How to add a new Pool

To manually add a pool, locate the file corresponding to the protocol version and add an object to the `pools` array.

### 1. Uniswap V2
```json
{
    "symbol": "WLD/USDC",
    "token0": "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    "token0Symbol": "WLD",
    "token1": "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    "token1Symbol": "USDC",
    "pairAddress": "0x...",
    "uniswapUrl": "https://app.uniswap.org/explore/pools/worldchain/0x...",
    "notes": "Verified pool"
}
```

### 2. Uniswap V3
Requires specifying the `fee` (in bps) and `tickSpacing`.
```json
{
    "symbol": "WLD/USDC",
    "token0": "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    "token1": "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    "fee": 3000, // 0.3%
    "tickSpacing": 60,
    "poolAddress": "0x...",
    "uniswapUrl": "https://app.uniswap.org/explore/pools/worldchain/0x...",
    "notes": "Concentrated liquidity"
}
```

### 3. Uniswap V4
Similar to V3, but includes the `hooks` address (use address zero `0x00...00` if no hooks are used).
```json
{
    "symbol": "WLD/ORB",
    "token0": "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    "token1": "0xF3F92A60e6004f3982F0FdE0d43602fC0a30a0dB",
    "fee": 31000, // 3.1%
    "tickSpacing": 200,
    "hooks": "0x0000000000000000000000000000000000000000",
    "uniswapUrl": "https://app.uniswap.org/explore/pools/worldchain/0x...",
    "notes": "Verified V4 Pool"
}
```

## Important
- **Addresses**: All addresses must be in checksum format (case-sensitive) to avoid failures in comparisons.
- **Synchronization**: When adding a pool, make sure the involved tokens are defined in `src/lib/tokens.ts`.
- **Fees**: Fees are expressed in basis points (bps). Example: `3000` = 0.3%, `10000` = 1%.
