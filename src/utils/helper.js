export const selectedName = (blockchainType, isSoltoToken,tokenName) => {
    if (blockchainType === "ETH") {
        return isSoltoToken ? "ETH" :  tokenName ;
    } else {
        return isSoltoToken ? "SOL" :  tokenName;
    }
}

export function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) {
      return "Invalid input";
    }
  
    const absNum = Math.abs(num);
    let formatted;
  
    if (absNum >= 1e9) {
      formatted = (num / 1e9).toFixed(1) + "B"; // Billions
    } else if (absNum >= 1e6) {
      formatted = (num / 1e6).toFixed(1) + "M"; // Millions
    } else if (absNum >= 1e3) {
      formatted = (num / 1e3).toFixed(1) + "K"; // Thousands
    } else {
      formatted = num.toString(); // Less than 1K
    }
  
    return formatted;
  }