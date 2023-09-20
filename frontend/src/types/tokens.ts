import { QueryNetwork, TokenFilter } from '@aws-sdk/client-managedblockchain-query';

export type Erc20TokenListToken = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export type TokenBalance = {
  balance: number;
  balanceUsd: number;
};

type BaseToken = {
  id: string;
  isLoading: boolean;
  error: null | Error;
  network: QueryNetwork;
  type: 'bitcoin' | 'ether' | 'erc20' | 'nft' | 'unknown';
  name: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
};

export type TokenBase = BaseToken & TokenBalance & TokenFilter;

export type TokenBitcoin = TokenBase & {
  tokenId: 'btc';
  type: 'bitcoin';
};

export type TokenEthereum = TokenBase & {
  tokenId: 'eth';
  type: 'ether';
};

export type TokenErc20 = Erc20TokenListToken &
  TokenBase & {
    type: 'erc20';
    contractAddress: TokenFilter['contractAddress'];
  };

export type TokenNft = TokenBase & {
  type: 'nft';
  tokenId: TokenFilter['tokenId'];
};

export type TokenUnknown = TokenBase & {
  type: 'unknown';
};

export type Token = TokenBitcoin | TokenEthereum | TokenErc20 | TokenNft | TokenUnknown;

export type PortfolioTokenBalances = Token & { accounts: (TokenBalance & { address: string })[] };

export type TokenMap = Map<string, PortfolioTokenBalances>;

export function isTokenBitcoin(t: Token): t is TokenBitcoin {
  const token = t as TokenBitcoin;

  return !!(token.tokenId == 'btc' && !token.contractAddress);
}

export function isTokenEthereum(t: Token): t is TokenEthereum {
  const token = t as TokenEthereum;

  return !!(token.tokenId == 'eth' && !token.contractAddress);
}

export function isTokenErc20(t: Token): t is TokenErc20 {
  const token = t as TokenErc20;

  return !!(token.contractAddress && !token.tokenId);
}

export function isTokenNft(t: Token): t is TokenNft {
  const token = t as TokenNft;

  return !!(token.contractAddress && token.tokenId);
}
