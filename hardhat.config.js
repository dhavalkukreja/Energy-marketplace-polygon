require("@nomiclabs/hardhat-waffle")

const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
//const privateKey = fs.readFileSync(".secret").toString()
const projectId = "994ab600d3a94aba9a0c1310b744a0e5"

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
//  unused configuration commented out for now
 mumbai: {
   //url: "https://polygon-mumbai.infura.io/v3/${projectId}",
   //url: "https://rpc-mumbai.matic.today",
   //url: "https://rpc-mumbai.maticvigil.com/v1/{App Id}", 
   url: "https://rpc-mumbai.maticvigil.com/v1/41cfcd66c6658de8defaf4b6290247790bc08211",
   accounts: [privateKey]
 },

//  mainnet:{
//   url: "https://polygon-mainnet.infura.io/v3/${projectId}",
//   accounts: [privateKey]
//  }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
