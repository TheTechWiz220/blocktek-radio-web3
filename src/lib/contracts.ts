import { ethers } from "ethers";

// ============================================
// DJ PASS NFT CONTRACT CONFIGURATION
// ============================================
// Update this address after deploying to your target network
export const DJ_PASS_ADDRESS = "0xYourDeployedDJPassAddress";

// Mint price in ETH
export const MINT_PRICE = "0.01";
export const MINT_PRICE_WEI = ethers.parseEther(MINT_PRICE);

// Contract ABI (only the functions we need)
export const DJ_PASS_ABI = [
  "function mint(uint256 quantity) external payable",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function numberMinted(address owner) view returns (uint256)",
  "function mintActive() view returns (bool)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function MAX_PER_WALLET() view returns (uint256)",
  "function MINT_PRICE() view returns (uint256)",
  "event Minted(address indexed minter, uint256 quantity, uint256 firstTokenId)",
];

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
export function getDJPassContract(signerOrProvider: ethers.Signer | ethers.Provider) {
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
export function getMintTxData(quantity: number) {
  const iface = new ethers.Interface(DJ_PASS_ABI);
  return iface.encodeFunctionData("mint", [quantity]);
}
