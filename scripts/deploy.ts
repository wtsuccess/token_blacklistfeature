import { ethers } from "hardhat";
import { ACME, ACME__factory } from "../typechain-types";

async function main() {
  const acmeFactory: ACME__factory = await ethers.getContractFactory("ACME");
  const acme: ACME = await acmeFactory.deploy(100000000000);
  await acme.deployed();
  console.log("acme address", acme.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
