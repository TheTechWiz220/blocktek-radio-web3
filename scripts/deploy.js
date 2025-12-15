import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const DJPass = await hre.ethers.getContractFactory("DJPass");
  const djPass = await DJPass.deploy();

  await djPass.waitForDeployment();

  console.log("DJPass deployed to:", await djPass.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
