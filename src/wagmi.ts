import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const abstractTestnet = defineChain({
    id: 11124,
    name: 'Abstract Sepolia Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'ETH',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://api.testnet.abs.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.testnet.abs.xyz' },
    },
})

export const abstractMainnet = defineChain({
    id: 2741,
    name: 'Abstract',
    nativeCurrency: {
        decimals: 18,
        name: 'ETH',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://api.abs.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.abs.xyz' },
    },
})

export const config = createConfig({
    chains: [abstractTestnet, abstractMainnet, mainnet, sepolia],
    connectors: [
        // Prefer MetaMask explicitly so network switching prompts the correct wallet
        metaMask(),
        // Fallback for other injected wallets
        injected(),
    ],
    transports: {
        [abstractTestnet.id]: http(),
        [abstractMainnet.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
})
