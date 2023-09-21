import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox"; //3.0.0 ^2.0.2
import "@openzeppelin/hardhat-upgrades"; // ^2.2.1
import "@nomicfoundation/hardhat-verify"; //^1.1.1
import { config as dotenvConfig } from "dotenv";


dotenvConfig();
const { PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    polygon: {
      url: "https://polygon-bor.publicnode.com",
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygon_mumbai: {
      url: "https://polygon-testnet.public.blastapi.io",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};

export default config;
