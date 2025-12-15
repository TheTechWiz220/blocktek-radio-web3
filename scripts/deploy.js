import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const DJPass = await hre.ethers.getContractFactory("DJPass");
  const baseURI = process.env.BASE_URI || "https://example.com/metadata/";
  const djPass = await DJPass.deploy(baseURI);

  await djPass.waitForDeployment();

  console.log("DJPass deployed to:", await djPass.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
