import { loadFixture } from "ethereum-waffle";
import { expect } from "chai";
import { ethers } from "hardhat";

async function basicFixture() {
  const [owner, user1, user2] = await ethers.getSigners();
  const user1Address = user1.address;
  const user2Address = user2.address;

  const ACME = await ethers.getContractFactory("ACME");
  const acme = await ACME.deploy(100);
  await acme.deployed();

  // token transfer
  await acme.transfer(user1Address, ethers.utils.parseEther("10"));
  await acme.transfer(user2Address, ethers.utils.parseEther("10"));

  return { acme, owner, user1, user2, user1Address, user2Address };
}

describe("acme", () => {
  it("token transfer before blacklist", async () => {
    const { acme, user1, user1Address, user2Address } = await loadFixture(
      basicFixture
    );
    await acme
      .connect(user1)
      .transfer(user2Address, ethers.utils.parseEther("5"));
    expect(await acme.balanceOf(user1Address)).to.be.equals(
      ethers.utils.parseEther("5")
    );
    expect(await acme.balanceOf(user2Address)).to.be.equals(
      ethers.utils.parseEther("15")
    );
  });

  it("should not transfer after blacklist", async () => {
    const { acme, user1, user2, user1Address, user2Address } =
      await loadFixture(basicFixture);

    await acme.setBlacklist(user1Address);
    await expect(
      acme.connect(user1).transfer(user2Address, ethers.utils.parseEther("1"))
    ).to.be.revertedWith("Sender Blacklisted");
    await expect(
      acme.connect(user2).transfer(user1Address, ethers.utils.parseEther("1"))
    ).to.be.revertedWith("Receiver Blacklisted");
  });

  it("should be able to transfer tokens again after set whitelist", async () => {
    const { acme, user1, user2, user1Address, user2Address } =
      await loadFixture(basicFixture);

    await acme.setWhitelist(user1Address);

    // can transfer token again
    await acme
      .connect(user1)
      .transfer(user2Address, ethers.utils.parseEther("1"));
    expect(await acme.balanceOf(user1Address)).to.be.equals(
      ethers.utils.parseEther("4")
    );
    expect(await acme.balanceOf(user2Address)).to.be.equals(
      ethers.utils.parseEther("16")
    );

    // can receive token again
    await acme
      .connect(user2)
      .transfer(user1Address, ethers.utils.parseEther("1"));
    expect(await acme.balanceOf(user1Address)).to.be.equals(
      ethers.utils.parseEther("5")
    );
    expect(await acme.balanceOf(user2Address)).to.be.equals(
      ethers.utils.parseEther("15")
    );
  });
});
