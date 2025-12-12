import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    abstractTestnet: {
      url: "https://api.testnet.abs.xyz",
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
