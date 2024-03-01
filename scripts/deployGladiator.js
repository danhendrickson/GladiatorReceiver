// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ContractName = "GladiatorReceiver";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploy contract: ${ContractName}`);
  console.log(`Deploying contracts with account: ${deployer}`);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory(ContractName);
  // Fill in the address parameters below ======>
  const token = await Token.deploy("0xb1b3188aD25B37Efe2456f4044615eA32ACa6B24", "0x8f3490Bb604b14cB199c64d49690c8d5FA5A8051", "0xBbE045Fffe8730EB28B98F7e7a31a47ba008F003", "0x932e4dF290642e9c6e479945d6CB0957C4129FBc");

  console.log(`Token Address: ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });