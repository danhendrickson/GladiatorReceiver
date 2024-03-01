# GladiatorReceiver Contract

## Getting started

1. Install Dependencies
```bash
npm install
```

2. Setup Environment
The `.env` keys needs the following values ( Goerli can be ignored if not being used ):
```bash
ETHERSCAN_API_KEY="API_KEY_FROM_ETHERSCAN"
ALCHEMY_API_KEY="API_KEY_FROM_ALCHEMY"
ETHEREUM_PRIVATE_KEY="ETH_PK"
SEPOLIA_PRIVATE_KEY="SEP_PK"
REPORT_GAS=true
```

3. Run tests
```bash
npx hardhat test
```

### Expected Test Output
```js
  Gladiator Receiver Contract

```

### Gas Analysis
```js
```

## [GladiatorReceiver Contract](/contracts/GladiatorReceiver.sol)
## [GladiatorReceiver Tests](/test/GladiatorReceiver.js)
## [GladiatorReceiver Deployer](/scripts/deployGladiator.js)
## [Gladii Deployer](/scripts/deployGladii.js)

## Deploying

Note: The `{yourNetwork}` value should be replaced with `sepolia` or `ethereum` based on the deploy target network.

Test using Hardhat
```bash
npx hardhat test --grep GladiatorReceiver
```

Deploy using Hardhat -- Will return newly created contract address
```bash
npx hardhat run --network {yourNetwork} scripts/deployGladiator.js
```

Verify using Hardhat -- Will take a minute or so and respond will Verification success
```bash
npx hardhat verify --network {yourNetwork} {contractAddress} --constructor-args {pathToArgumentsFile}
```