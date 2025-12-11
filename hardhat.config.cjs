// hardhat.config.cjs
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();  // Loads .env

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    abstractTestnet: {
      url: "https://api.testnet.abs.xyz",  // Public RPC
      chainId: 11124,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    abstract: {
      url: "https://api.abs.xyz",
      chainId: 2741,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};