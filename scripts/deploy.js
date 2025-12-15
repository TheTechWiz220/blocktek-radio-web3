import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying BlockTek DJ Pass NFT...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(
    "Account balance:",
    hre.ethers.formatEther(balance),
    "ETH\n"
  );

  // Base URI for metadata (replace with IPFS CID later)
  const baseURI = "ipfs://YOUR_METADATA_CID/";

  // Get contract factory
  const DJPass = await hre.ethers.getContractFactory("DJPass");

  // Deploy contract
  const djPass = await DJPass.deploy(baseURI);

  await djPass.waitForDeployment();

  const contractAddress = await djPass.getAddress();

  console.log("✅ BlockTek DJ Pass deployed to:", contractAddress);
  console.log("\n📝 Next steps:");
  console.log("1. Update your frontend with this contract address");
  console.log("2. Upload metadata to IPFS and update baseURI");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
