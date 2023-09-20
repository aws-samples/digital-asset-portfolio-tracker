import { createContext, useRef, useState } from 'react';
import {
  Erc20TokenListToken,
  TokenBitcoin,
  TokenMap,
  PortfolioTokenBalances,
  isTokenBitcoin,
  isTokenErc20,
  isTokenEthereum,
  isTokenNft
} from '../types/tokens';
import {
  getErc20TokenList,
  getEthereumTokenPricesByContractAddress,
  getTokenPricesByIds
} from '../services/coingecko';
import {
  ACCOUNT_TOKEN_LIMIT,
  batchGetBitcoinBalance,
  getAmbQueryTokenId,
  listAllEthereumTokenBalancesForAddress
} from '../services/amb-query/tokens';
import { NETWORK_IDS } from '../types/accounts';
import { useRunOnChange } from '../hooks/useRunOnChange';
import toast from 'react-hot-toast';
import { CoinGeckoTokenPrices } from '../types/coingecko';
import { formatEther, formatUnits } from 'ethers';
import { getNetworkIcon } from '../utility/networks';
import { useAccountsSelectedBitcoin } from '../hooks/useAccountsSelectedBitcoin';
import { useAccountsSelectedEthereum } from '../hooks/useAccountsSelectedEthereum';
import { useAppState } from '../hooks/useAppState';
import { TokenBalance } from '@aws-sdk/client-managedblockchain-query';

type TokenContextProps = {
  isLoading: boolean;
  isPolling: boolean;
  error: Error | null;
  tokenMap: TokenMap;
  tokens: PortfolioTokenBalances[];
  erc20TokenList: Erc20TokenListToken[];
  tokenPrices: CoinGeckoTokenPrices;
  fetchTokensForAccounts: (refresh?: boolean) => Promise<void>;
};

export const TokenContext = createContext<TokenContextProps>(null);

export const TokenContextProvider: React.FC<React.HTMLProps<HTMLElement>> = ({
  children
}: React.HTMLProps<HTMLElement>) => {
  const { isInitialized } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tokenMap, setTokenMap] = useState<TokenMap>(new Map());
  const [erc20TokenList, setErc20TokenList] = useState<Erc20TokenListToken[]>([]);
  const [tokenPrices, setTokenPrices] = useState<CoinGeckoTokenPrices>(null);
  const fetchTokenBalanceInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const bitcoinAccounts = useAccountsSelectedBitcoin();
  const ethereumAccounts = useAccountsSelectedEthereum();

  /**
   * Uses AMB Query and CoinGecko to get the tokens and their prices for each user account
   */
  const fetchTokensForAccounts = async (refresh = true) => {
    setIsLoading(!refresh);
    setIsPolling(refresh);

    // Reset Token Map if this not a refresh as this can mean the user changed accounts

    let _tokenMap = tokenMap;

    if (!refresh) {
      _tokenMap = new Map();
    }

    // Only fetch tokens if the user has entered any accounts
    // Callers of this function should arguable only do so if there are accounts, but adding this safe guard here to limit network requests

    if (bitcoinAccounts.length || ethereumAccounts.length) {
      // Set loading state of all tokens if this is a refresh

      if (refresh) {
        for (const [tokenKey, token] of _tokenMap) {
          token.isLoading = true;
        }

        setTokenMap(new Map(_tokenMap));
      }

      if (bitcoinAccounts.length) {
        // Get Bitcoin balance for user's addresses with AMB Query

        const tokenBitcoin: TokenBitcoin = {
          id: getAmbQueryTokenId({ network: NETWORK_IDS.BITCOIN, tokenId: 'btc' }),
          isLoading: true,
          error: null,
          network: NETWORK_IDS.BITCOIN,
          type: 'bitcoin',
          tokenId: 'btc',
          name: 'Bitcoin',
          symbol: 'Bitcoin',
          decimals: 8,
          iconUrl: getNetworkIcon('bitcoin'),
          balance: null,
          balanceUsd: null
        };

        if (!_tokenMap.has(tokenBitcoin.id)) {
          _tokenMap.set(tokenBitcoin.id, {
            ...tokenBitcoin,
            accounts: bitcoinAccounts.map(({ address }) => ({
              address,
              balance: null,
              balanceUsd: null
            }))
          });

          setTokenMap(new Map(_tokenMap));
        }

        const bitcoinBalances = await batchGetBitcoinBalance(bitcoinAccounts);

        tokenBitcoin.balance = bitcoinBalances.reduce((currentBalance, getBalanceResult) => {
          return +currentBalance + +getBalanceResult.balance;
        }, 0);

        _tokenMap.set(tokenBitcoin.id, {
          ...tokenBitcoin,
          accounts: bitcoinAccounts.map(({ address }, i) => ({
            address,
            balance: +bitcoinBalances[i].balance,
            balanceUsd: null
          }))
        });

        setTokenMap(new Map(_tokenMap));
      } else {
        // Remove Bitcoin from token map if user no longer has any Bitcoin accounts selected

        const bitcoinTokenId = getAmbQueryTokenId({ network: NETWORK_IDS.BITCOIN, tokenId: 'btc' });

        if (_tokenMap.has(bitcoinTokenId)) {
          _tokenMap.delete(bitcoinTokenId);
        }
      }

      if (ethereumAccounts.length) {
        // Fetch ERC20 Token List from CoinGecko

        let tokenList: Erc20TokenListToken[] = [];

        try {
          tokenList = await getErc20TokenList();

          setError(null);
          setErc20TokenList(tokenList);
        } catch (error) {
          console.error(error);

          setError(new Error('Could not fetch ERC20 token list'));
        }

        // Get Ethereum and ERC20 balances for user's accounts with AMB Query

        let ethereumTokenBalances: TokenBalance[][] = [];

        try {
          ethereumTokenBalances = await Promise.all(
            ethereumAccounts.map(({ address }) => listAllEthereumTokenBalancesForAddress(address))
          );

          setError(null);

          // Show a toast if we've fetched the token limit for an account

          let didHitAccountTokenLimit = false;

          for (const tokenBalances of ethereumTokenBalances) {
            if (tokenBalances.length >= ACCOUNT_TOKEN_LIMIT) {
              didHitAccountTokenLimit = true;

              break;
            }
          }

          // Only show the toast on the first load to its now shown on every background refresh

          if (didHitAccountTokenLimit && !refresh) {
            toast(
              `A total of ${ACCOUNT_TOKEN_LIMIT} tokens are fetched per account. One or more of your accounts exceeds this limit.`
            );
          }
        } catch (error) {
          console.error(error);

          setError(new Error('Could not fetch token balances'));
        }

        // Remove ERC tokens from the token map that the user no longer owns

        for (const tokenId of _tokenMap.keys()) {
          if (!tokenId.toLowerCase().includes('bitcoin')) {
            for (const tokenBalances of ethereumTokenBalances) {
              if (
                !tokenBalances.some(
                  (tokenBalance) => tokenId == getAmbQueryTokenId(tokenBalance.tokenIdentifier)
                )
              ) {
                _tokenMap.delete(tokenId);
              }
            }
          }
        }

        // Add tokens to token map

        for (const tokenBalances of ethereumTokenBalances) {
          for (const {
            balance,
            tokenIdentifier: { contractAddress, network, tokenId }
          } of tokenBalances) {
            const tokenKey = getAmbQueryTokenId({ network, tokenId, contractAddress });
            let token = _tokenMap.get(tokenKey);

            if (!token) {
              token = {
                id: getAmbQueryTokenId({ network: NETWORK_IDS.ETHEREUM, contractAddress, tokenId }),
                network: NETWORK_IDS.ETHEREUM,
                name: contractAddress,
                type: 'unknown',
                symbol: 'Unknown',
                contractAddress,
                tokenId,
                balance: null,
                balanceUsd: null,
                isLoading: true,
                error: null
              } as PortfolioTokenBalances;

              if (isTokenErc20(token)) {
                const erc20Token: Erc20TokenListToken = tokenList.find(
                  ({ address }) => address == token.contractAddress
                );

                token.type = 'erc20';

                if (erc20Token) {
                  token.balance = +formatUnits(balance.toString(), erc20Token.decimals);
                  token.name = erc20Token.name;
                  token.iconUrl = erc20Token.logoURI;
                  token.decimals = erc20Token.decimals;

                  for (const [key, value] of Object.entries(erc20Token)) {
                    token[key] = value;
                  }
                }
              } else if (isTokenNft(token)) {
                token.balance = +balance;
                token.tokenId = Number(token.tokenId).toString();
                token.type = 'nft';
                token.decimals = 0;
              } else if (isTokenEthereum(token)) {
                token.balance = +formatEther(balance.toString());
                token.type = 'ether';
                token.name = 'Ether';
                token.iconUrl = getNetworkIcon('ethereum');
                token.symbol = 'Ether';
                token.decimals = 18;
              }
            }

            const accountBalances = ethereumTokenBalances.flatMap((tokenBalances) =>
              tokenBalances.flatMap((tokenBalance) => {
                if (tokenKey == getAmbQueryTokenId(tokenBalance.tokenIdentifier)) {
                  let balance;

                  if (isTokenErc20(token)) {
                    const decimals = token.decimals;

                    balance = +formatUnits(tokenBalance.balance, decimals);
                  } else if (isTokenEthereum(token)) {
                    balance = +formatEther(tokenBalance.balance);
                  } else {
                    balance = +balance;
                  }

                  return [{ balance, address: tokenBalance.ownerIdentifier.address }];
                }

                return [];
              })
            );

            _tokenMap.set(tokenKey, {
              ...token,
              accounts: accountBalances.map(({ balance, address }) => ({
                address,
                balance: balance,
                balanceUsd: null
              }))
            });

            setTokenMap(new Map(_tokenMap));
          }
        }
      } else {
        // Remove all ERC tokens from token map if user no longer has any Ethereum accounts selected

        for (const tokenId of _tokenMap.keys()) {
          if (!tokenId.toLowerCase().includes('bitcoin')) {
            _tokenMap.delete(tokenId);
          }
        }
      }

      // Update total token balance using the balances for each account

      for (const [tokenId, token] of _tokenMap) {
        const totalBalance = token.accounts.reduce((total, { balance }) => {
          return total + balance;
        }, 0);

        _tokenMap.set(tokenId, { ...token, balance: totalBalance });
      }

      setTokenMap(new Map(_tokenMap));

      // Get each token price from CoinGecko and update state

      const tokenIds = new Set<string>();
      const tokenContractAddresses = new Set<string>();

      for (const token of _tokenMap.values()) {
        if (isTokenBitcoin(token)) {
          tokenIds.add('bitcoin');
        } else if (isTokenEthereum(token)) {
          tokenIds.add('ethereum');
        } else if (isTokenErc20(token)) {
          tokenContractAddresses.add(token.contractAddress);
        }
      }

      let tokenPricesById;
      let tokenPricesByContractAddess;
      let tokenPrices;

      try {
        if (tokenIds.size) {
          tokenPricesById = await getTokenPricesByIds([...tokenIds]);
        }

        if (tokenContractAddresses.size) {
          tokenPricesByContractAddess = await getEthereumTokenPricesByContractAddress([
            ...tokenContractAddresses
          ]);
        }

        setError(null);

        tokenPrices = { ...tokenPricesById, ...tokenPricesByContractAddess };

        setTokenPrices({ ...tokenPrices });

        for (const [tokenKey, token] of _tokenMap) {
          token.isLoading = false;

          if (isTokenBitcoin(token)) {
            const bitcoinPrice = tokenPrices['bitcoin']?.usd;

            if (bitcoinPrice) {
              _tokenMap.set(tokenKey, {
                ...token,
                balanceUsd: +token.balance.toString() * bitcoinPrice,
                accounts: token.accounts.map((accountToken) => {
                  return {
                    ...accountToken,
                    balanceUsd: +accountToken.balance.toString() * bitcoinPrice
                  };
                })
              });
            }
          } else if (isTokenEthereum(token)) {
            const ethereumPrice = tokenPrices['ethereum']?.usd;

            if (ethereumPrice) {
              _tokenMap.set(tokenKey, {
                ...token,
                balanceUsd: +token.balance.toString() * ethereumPrice,
                accounts: token.accounts.map((accountToken) => {
                  return {
                    ...accountToken,
                    balanceUsd: +accountToken.balance.toString() * ethereumPrice
                  };
                })
              });
            }
          } else if (isTokenErc20(token)) {
            const tokenPrice = tokenPrices[token.contractAddress]?.usd;

            if (tokenPrice) {
              _tokenMap.set(tokenKey, {
                ...token,
                balanceUsd: +token.balance.toString() * tokenPrice,
                accounts: token.accounts.map((accountToken) => {
                  return {
                    ...accountToken,
                    balanceUsd: +accountToken.balance.toString() * tokenPrice
                  };
                })
              });
            }
          }
        }

        setTokenMap(new Map(_tokenMap));
      } catch (error) {
        console.error(error);

        setError(new Error('Could not fetch token prices, CoinGecko API limit hit'));
      }
    }

    setIsLoading(false);
    setIsPolling(false);
  };

  // Update balances each time the user updates their account selections and very 10 seconds after that

  // TODO: Update Ethereum and Bitcoin balances when new blocks are mined

  useRunOnChange(async () => {
    if (isInitialized) {
      if (fetchTokenBalanceInterval.current) {
        clearInterval(fetchTokenBalanceInterval.current);
      }

      await fetchTokensForAccounts(false);

      setTimeout(() => {
        fetchTokenBalanceInterval.current = setInterval(fetchTokensForAccounts, 10000);
      });

      return () => {
        clearInterval(fetchTokenBalanceInterval.current);
      };
    }
  }, [isInitialized, bitcoinAccounts, ethereumAccounts]);

  useRunOnChange(() => {
    if (error) {
      toast.error(error.message);
    }
  }, error);

  return (
    <TokenContext.Provider
      value={{
        isLoading,
        isPolling,
        error,
        tokenMap,
        tokens: [...tokenMap.values()],
        erc20TokenList,
        tokenPrices,
        fetchTokensForAccounts
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
