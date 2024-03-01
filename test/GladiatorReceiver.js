const {
  EtherscanProvider
} = require("@ethersproject/providers");
const {
  loadFixture
} = require("@nomicfoundation/hardhat-network-helpers");
const {
  expect
} = require("chai");
const {
  ethers
} = require("hardhat");

// Constructors
const _CONTRACT_NAME = "GladiatorReceiver";
const _TOKEN_NAME = "Gladii"

// Tokens
const ETH_TOKEN_ADDR = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
const USDC_TOKEN_ADDR = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

// Possible Reversions
const TokenNotAllowed = "TokenNotAllowed";
const EthTransferFailed = "EthTransferFailed";

describe("Gladiator Receiver Contract", function () {

  async function deployTokenFixture() {
      const Contract = await ethers.getContractFactory(_CONTRACT_NAME);
      const Token = await ethers.getContractFactory(_TOKEN_NAME);
      const [owner, addr1, addr2, addr3, addr4, addr5, addr6] = await ethers.getSigners();

      const deployedContract = await Contract.deploy(addr5.address, addr4.address, addr3.address, addr1.address);
      await deployedContract.deployed();
      await deployedContract.allowAddress(ETH_TOKEN_ADDR);

      const tokenContract = await Token.deploy()
      await tokenContract.deployed();

      await deployedContract.allowAddress(tokenContract.address);
      await tokenContract.transfer(addr1.address, 10);

      return {
          deployedContract,
          tokenContract,
          owner,
          addr1,
          addr2,
          addr3,
          addr4,
          addr5,
          addr6,
      };
  }

  describe("Set Up", function() {
      it("Should deploy as an empty contract", async function () {
          const {
              deployedContract,
            } = await loadFixture(
              deployTokenFixture
            );

            // Get contract balance
            const initialETHBalance = await deployedContract.provider.getBalance(deployedContract.address);
            expect(initialETHBalance).to.be.equal(0);
      })
  })

  describe("Deposits", function() {
      it("Should accept deposits of ERC20 Tokens", async function () {

          const {
              deployedContract,
              tokenContract,
              addr1,
              addr2,
              addr3
            } = await loadFixture(
              deployTokenFixture
            );

            await tokenContract.connect(addr1).approve(deployedContract.address, 100)
            await deployedContract.connect(addr1).deposit(tokenContract.address, 10);

            const contractBalance = await deployedContract.balanceOfToken(tokenContract.address);
            expect(contractBalance).to.be.equal(10);
      })

      it("Should accept deposits of ETH", async function () {

        const {
            deployedContract,
            tokenContract,
            addr1,
            addr2,
            addr3,
            addr4,
            addr5
          } = await loadFixture(
            deployTokenFixture
          );

          await addr2.sendTransaction({
            to: deployedContract.address,
            value: ethers.utils.parseEther("10.0"), // Sends exactly 10 ether
          });

          const contractBalance = await ethers.provider.getBalance(deployedContract.address);
          expect(contractBalance).to.be.equal(ethers.utils.parseEther("10.0"));
      })
  })

  describe("Withdrawals", function() {
    it("Should split withdrawal of ETH Tokens", async function () {

      const {
          deployedContract,
          tokenContract,
          owner,
          addr1,
          addr2,
          addr3,
          addr4,
          addr5
        } = await loadFixture(
          deployTokenFixture
        );

        await addr2.sendTransaction({
          to: deployedContract.address,
          value: ethers.utils.parseEther("10.0"), // Sends exactly 10 ether
        });

        const contractBalance = await ethers.provider.getBalance(deployedContract.address);
        expect(contractBalance).to.be.equal(ethers.utils.parseEther("10.0"));

        await deployedContract.connect(owner).withdrawEth();


        /**
         * We passed the contract initially 10 ETH. When the contract withdraw
         * is called we expect the total amount of 10 ETH to be split evenly 4 ways
         * leaving 2.5ETH on top of the original accounts balance.
         */
        const mhfBalance = await ethers.provider.getBalance(addr5.address);
        expect(mhfBalance).to.be.equal(ethers.utils.parseEther("10002.5"));

        const asancBalance = await ethers.provider.getBalance(addr4.address);
        expect(asancBalance).to.be.equal(ethers.utils.parseEther("10002.5"));

        const crocBalance = await ethers.provider.getBalance(addr3.address);
        expect(crocBalance).to.be.equal(ethers.utils.parseEther("10002.5"));

        const devBalance = await ethers.provider.getBalance(addr1.address);
        expect(devBalance).to.be.equal(ethers.utils.parseEther("10002.5"));
  })

  it("Should split withdrawal of ERC20 Tokens", async function () {

    const {
        deployedContract,
        tokenContract,
        owner,
        addr1,
        addr2,
        addr3,
        addr4,
        addr5
      } = await loadFixture(
        deployTokenFixture
      );

      await tokenContract.connect(addr1).approve(deployedContract.address, 100)
      await deployedContract.connect(addr1).deposit(tokenContract.address, 10);

      const contractBalance = await deployedContract.balanceOfToken(tokenContract.address);
      console.log("CONTRACT BALANCE", contractBalance);
      expect(contractBalance).to.be.equal(10);


      await deployedContract.connect(owner).withdraw(tokenContract.address);

      const devBalance = await tokenContract.balanceOf(addr1.address);
      expect(devBalance).to.be.equal(10);

      const contractBalance2 = await deployedContract.balanceOfToken(tokenContract.address);
      console.log("CONTRACT BALANCE2", contractBalance2);
      expect(contractBalance2).to.be.equal(0);
  })
})

})