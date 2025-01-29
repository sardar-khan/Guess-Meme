import EthContractAbi  from "./EthContractAbi.json"
export const EthConfig = {
    "ContractAddress": "0x20c09aCCe0cAe954715B30AD421D2836BEdA58Db",
    "Abi": EthContractAbi
}


export const GetContractConfiguration = async(blockchain)=>{
    switch (blockchain) {
        case "ETH":
           return EthConfig
          break;
        case "POL":
          ethereumNetworks = [polygonAmoy];
          break;
        case "BNB":
          return EthConfig
          break;
        default:
          ethereumNetworks = [];
      }
}