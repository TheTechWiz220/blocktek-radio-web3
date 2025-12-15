require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Hardhat configuration (CommonJS).
 * Ensure you have a .env file with ABSTRACT_RPC_URL and PRIVATE_KEY.
 */
module.exports = {
  solidity: "0.8.20",
  networks: {
    abstractTestnet: {
      url: process.env.ABSTRACT_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
