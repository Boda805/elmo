// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
// export const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
// export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

//BLOCKNATIVE ID FOR Notify.js:
// export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77"


export const NETWORK = (chainId)=>{
    for(let n in NETWORKS){
      if(NETWORKS[n].chainId==chainId){
        return NETWORKS[n]
      }
    }
  }
  
  export const NETWORKS = {
      localhost: {
          name: "localhost",
          color: '#666666',
          chainId: 1337,
          blockExplorer: '',
          rpcUrl: "http://" + window.location.hostname + ":8545",
      },
      optimism: {
        name: "optimism",
        color: '#ff8b9e',
        chainId: 69,
        blockExplorer: '',
        rpcUrl: "https://kovan.optimism.io",
      },
      kovan: {
        name: "kovan",
        color: '#7003DD',
        chainId: 42,
        blockExplorer: 'https://kovan.etherscan.io/',
        rpcUrl: "https://kovan.infura.io/v3/22403b346d9844e9ac9fcedbee9f8399",
      },

  }

