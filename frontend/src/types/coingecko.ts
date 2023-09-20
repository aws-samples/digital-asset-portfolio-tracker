export type CoinGeckoCoin = {
  id: string;
  symbol: string;
  name: string;
};

export type CoinGeckoTokenPrices = {
  [key: string]: { usd: number };
};
