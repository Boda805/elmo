require("@nomiclabs/hardhat-waffle");
require('@eth-optimism/hardhat-ovm');

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: "0.7.6",

  networks: {
    optimism: {
      chainId: 69,
      url: 'https://kovan.optimism.io',
      // This sets the gas price to 0 for all transactions on L2. We do this
      // because account balances are not automatically initiated with an ETH
      // balance (yet, sorry!).
      gasPrice: 0,
      ovm: true // This sets the network as using the ovm and ensure contract will be compiled against that.
    },
    kovan: {
      chainId: 42,
      url: "https://kovan.infura.io/v3/22403b346d9844e9ac9fcedbee9f8399"
    }
  }

};
