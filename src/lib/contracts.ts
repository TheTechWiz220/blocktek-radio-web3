// src/lib/contracts.ts
import { ethers } from "ethers";

// ============================================
// DJ PASS NFT CONTRACT CONFIGURATION
// ============================================

// Your deployed contract on Abstract Testnet
export const DJ_PASS_ADDRESS = "0xdDE722c0Bd707b3774e70b9a72f7cf4f2ddc614C";

// Mint price in ETH (for display)
export const MINT_PRICE = "0.0001";
export const MINT_PRICE_WEI = ethers.parseEther(MINT_PRICE);

// FULL ABI with proper object format (required for wagmi/viem/writeContract)
export const DJ_PASS_ABI = [
  {
    inputs: [{ internalType: "string", name: "baseURI", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "MINT_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_PER_WALLET",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "numberMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "baseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "active", type: "bool" }],
    name: "setMintActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "firstTokenId",
        type: "uint256",
      },
    ],
    name: "Minted",
  },
] as const;

// Network configuration
export const SUPPORTED_NETWORKS = {
  // Abstract Testnet
  11124: {
    name: "Abstract Testnet",
    rpcUrl: "https://api.testnet.abs.xyz",
    explorer: "https://explorer.testnet.abs.xyz",
  },
  // Abstract Mainnet
  2741: {
    name: "Abstract",
    rpcUrl: "https://api.abs.xyz",
    explorer: "https://explorer.abs.xyz",
  },
  // Sepolia (for testing)
  11155111: {
    name: "Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
  },
  // Ethereum Mainnet
  1: {
    name: "Ethereum",
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
  },
};

/**
 * Get DJ Pass contract instance
 */
export function getDJPassContract(
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(DJ_PASS_ADDRESS, DJ_PASS_ABI, signerOrProvider);
}

/**
 * Check if address is a valid deployed contract
 */
export function isValidContractAddress(address: string): boolean {
  return (
    address.length === 42 &&
    address.startsWith("0x") &&
    !address.toLowerCase().includes("your")
  );
}

/**
 * Get mint transaction data
 */
export function getMintTxData(quantity: number = 1) {
  const iface = new ethers.Interface(DJ_PASS_ABI);
  return iface.encodeFunctionData("mint", [quantity]);
}
