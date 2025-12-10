# BlockTek DJ Pass NFT

ERC721A-based NFT that grants DJ privileges on BlockTek Radio.

## Contract Details

- **Name**: BlockTek DJ Pass
- **Symbol**: BTDJ  
- **Mint Price**: 0.01 ETH
- **Max Supply**: 1,000
- **Max Per Wallet**: 5

## Setup

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install erc721a @openzeppelin/contracts
```

2. Create `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key
```

## Deployment

### Sepolia Testnet (Testing)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Abstract Testnet
```bash
npx hardhat run scripts/deploy.js --network abstractTestnet
```

### Abstract Mainnet
```bash
npx hardhat run scripts/deploy.js --network abstract
```

## After Deployment

Update the contract address in:
1. `src/lib/contracts.ts` → `DJ_PASS_ADDRESS`
2. Verify on block explorer (optional):
```bash
npx hardhat verify --network <network> <contract_address> "<baseURI>"
```

## Features

- **Gas-efficient minting** via ERC721A (batch mint optimization)
- **Owner functions**: `ownerMint()`, `setMintActive()`, `setBaseURI()`, `withdraw()`
- **Per-wallet limits**: Max 5 per wallet
- **Pausable minting**: Owner can toggle `mintActive`

## Network Info

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Abstract Testnet | 11124 | https://api.testnet.abs.xyz |
| Abstract Mainnet | 2741 | https://api.abs.xyz |
| Sepolia | 11155111 | https://rpc.sepolia.org |
