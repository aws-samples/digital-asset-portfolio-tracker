import { Erc20TokenListToken } from '../types/tokens';
import { fetchJson } from './fetch';

/**
 * Fetches CoinGecko's ERC20 Token List
 */
export async function getErc20TokenList() {
  try {
    const {
      body: { tokens }
    } = await fetchJson('https://tokens.coingecko.com/uniswap/all.json', 'GET');

    return tokens as Erc20TokenListToken[];
  } catch (error) {
    console.error('Failed to get CoinGecko ERC20 Token List', error);

    return Promise.reject(error);
  }
}

/**
 * Fetches CoinGecko's list of supported coins
 */
export async function getCoinGeckoCoins() {
  try {
    const coinGeckoCoinsResponse = await fetchJson(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
      'GET'
    );

    return coinGeckoCoinsResponse.body;
  } catch (error) {
    console.error('Failed to get CoinGecko tokens', error);

    return Promise.reject(error);
  }
}

/**
 * Fetches CoinGecko's suppported Ethereum tokens
 */
export async function getCoinGeckoEthereumTokens() {
  const coinGeckoCoins = await getCoinGeckoCoins();

  return coinGeckoCoins.flatMap(({ id, platforms: { ethereum } }) =>
    ethereum ? [{ id, address: ethereum }] : []
  );
}

/**
 * Fetches token prices from CoinGecko by CoinGecko Coin ID(s)
 */
export async function getTokenPricesByIds(ids: string[]) {
  try {
    const response = await fetchJson(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`,
      'GET'
    );

    return response.body;
  } catch (error) {
    console.error('Failed to get CoinGecko token prices for', ids.join(', '), error);

    return Promise.reject(error);
  }
}

/**
 * Fetches ethereum token prices from CoinGecko by contract address
 */
export async function getEthereumTokenPricesByContractAddress(contractAddresses: string[]) {
  try {
    const response = await fetchJson(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddresses.join(
        ','
      )}&vs_currencies=usd`,
      'GET'
    );

    return response.body;
  } catch (error) {
    console.error('Failed to get CoinGecko token prices for', contractAddresses.join(', '), error);

    return Promise.reject(error);
  }
}
