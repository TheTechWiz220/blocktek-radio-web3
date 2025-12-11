require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
    },
    
    // Abstract Chain Testnet
    abstractTestnet: {
      url: "https://api.testnet.abs.xyz",  // Public RPC — no key needed
      chainId: 11124,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    
    // Abstract Chain Mainnet
    abstract: {
      url: "https://api.abs.xyz",  // Public RPC — no key needed
      chainId: 2741,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    
    // Sepolia Testnet (for testing)
    sepolia: {
      url: "https://rpc.sepolia.org",  // Public RPC — no key needed
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      abstract: process.env.ABSTRACT_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};