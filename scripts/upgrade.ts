import { ethers, upgrades } from "hardhat";

async function main() {
  const ACME =
    await ethers.getContractFactory("ACME");
  const acme = await upgrades.upgradeProxy("0x85F3EdF636698f09cd2AF319ff9A10199Cd6056B", ACME);
  console.log("Contract Upgraded", await acme.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
