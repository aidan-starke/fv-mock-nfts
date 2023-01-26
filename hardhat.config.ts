import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import { config as dotenv } from "dotenv";
import { task, types } from "hardhat/config";
import { HardhatUserConfig } from "hardhat/config";

dotenv();

import mock_mint from "./scripts/mock/mint";

task("mock_mint", "Mints seekers to an address")
  .addParam("address", "The address to mint to")
  .addParam("contract", "The contract to mint")
  .addParam("amount", "The amount of seekers to mint", 1, types.int)
  .setAction(async (taskArgs, { ethers }) => {
    await mock_mint(ethers, taskArgs);
  });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_TOKEN}`,
      accounts: [`0x${process.env.ETH_ACCOUNT_KEY}`],
    },
  },
  etherscan: {
    apiKey: "TJ1MBI2J7FEICQY3GHNY8G8SXZ51UHSCZC",
  },
};

export default config;
