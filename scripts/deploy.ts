import { ethers, upgrades } from "hardhat";

async function main() {
  const acmeFactory = await ethers.getContractFactory("ACME");
  const acme = await upgrades.deployProxy(
    acmeFactory,
    [
      100000000000
    ],
    {
      initializer: "initialize",
    }
  );
  await acme.waitForDeployment();
  console.log("acme address", await acme.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
