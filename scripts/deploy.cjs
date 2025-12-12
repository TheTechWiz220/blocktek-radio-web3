import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying BlockTek DJ Pass NFT...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Base URI for metadata (update with IPFS later)
  const baseURI = "ipfs://YOUR_METADATA_CID/";

  // Deploy contract
  const DJPass = await hre.ethers.getContractFactory("DJPass");
  const djPass = await DJPass.deploy(baseURI);

  await djPass.waitForDeployment();
  const contractAddress = await djPass.getAddress();

  console.log("✅ BlockTek DJ Pass deployed to:", contractAddress);
  console.log("\n📝 Next steps:");
  console.log("1. Update DJ_PASS_CONTRACT in Dashboard.tsx with:", contractAddress);
  console.log("2. Get test ETH from faucet and mint!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
