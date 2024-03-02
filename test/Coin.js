const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Coin", function () {
  async function deployFixture() {
    const [player] = await hre.ethers.getSigners();

    const Coin = await ethers.deployContract("Coin");
    await Coin.waitForDeployment();
    const CoinAddr = Coin.target;
    console.log("Адрес Coin токена:", CoinAddr);
    console.log("Ваш баланс:", await Coin.balanceOf(player));

    return { Coin, player };
  }

  it("hack", async function () {
    const { Coin, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    const CoinMid = await ethers.deployContract("CoinMid");
    await CoinMid.waitForDeployment();

    const maxUint256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    //await Coin.approve(CoinMid.target, maxUint256);
    const addressPlayer = await player.getAddress();
    console.log("approved:", addressPlayer);
    await Coin.approve(CoinMid.target, maxUint256);
    await CoinMid.transferOutTokens(Coin.target, addressPlayer, CoinMid.target, await Coin.balanceOf(addressPlayer));
    
    // const maxUint256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    // await Coin.transferFrom(Coin.target, Coin.target, 1);
    // баланс контракта прокси в токене HSE должен стать 0
    expect(await Coin.balanceOf(player)).to.equal(0);
  });
});
