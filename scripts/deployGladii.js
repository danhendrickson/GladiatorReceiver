// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ContractName = "Gladii";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploy contract: ${ContractName}`);
  console.log(`Deploying contracts with account: ${deployer}`);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const initialSupply = ethers.utils.parseUnits("1000000", 18);
  const Token = await ethers.getContractFactory(ContractName);
  const token = await Token.deploy(initialSupply);

  console.log(`Token Address: ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });