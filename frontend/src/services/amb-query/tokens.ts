import {
  ListTokenBalancesCommand,
  TokenFilter,
  GetTokenBalanceCommand,
  BatchGetTokenBalanceCommand,
  ListTokenBalancesCommandOutput,
  ListTokenBalancesCommandInput,
  TokenBalance
} from '@aws-sdk/client-managedblockchain-query';
import { callChainQuery } from '.';

const LIST_TOKEN_BALANCES_MAX_PAGES = 10;
const LIST_TOKEN_BALANCES_MAX_RESULTS = 100;
export const ACCOUNT_TOKEN_LIMIT = LIST_TOKEN_BALANCES_MAX_PAGES * LIST_TOKEN_BALANCES_MAX_RESULTS;

export async function listTokenBalancesForAddress(
  address: string,
  network: TokenFilter['network'],
  nextToken?: ListTokenBalancesCommandInput['nextToken']
): Promise<ListTokenBalancesCommandOutput> {
  const command = new ListTokenBalancesCommand({
    ownerFilter: {
      address
    },
    tokenFilter: {
      network
    },
    maxResults: LIST_TOKEN_BALANCES_MAX_RESULTS,
    nextToken
  });

  return callChainQuery(command);
}

export async function listAllTokenBalancesForAddress(
  address: string,
  network: TokenFilter['network']
): Promise<TokenBalance[]> {
  const allTokenBalances: TokenBalance[] = [];
  let pageCount = 0;

  /**
   * Recursively fetches all pages of the addresses' token balances from AMB Query
   */
  async function fetchPage(token?: ListTokenBalancesCommandInput['nextToken']) {
    const { tokenBalances, nextToken } = await listTokenBalancesForAddress(address, network, token);

    allTokenBalances.push(...tokenBalances);

    pageCount++;

    const isPageLimitReached = pageCount >= LIST_TOKEN_BALANCES_MAX_PAGES;

    if (!nextToken || isPageLimitReached) {
      return allTokenBalances;
    }

    return fetchPage(nextToken);
  }

  return fetchPage();
}

export async function listAllEthereumTokenBalancesForAddress(address: string) {
  // If the user has no Ether balance, add it with a balance of 0

  const tokenBalances = await listAllTokenBalancesForAddress(address, 'ETHEREUM_MAINNET');

  if (!tokenBalances.some((tokenBalance) => tokenBalance.tokenIdentifier?.tokenId == 'eth')) {
    const emptyEtherBalance: TokenBalance = {
      balance: '0',
      tokenIdentifier: {
        network: 'ETHEREUM_MAINNET',
        tokenId: 'eth'
      },
      ownerIdentifier: {
        address
      },
      atBlockchainInstant: { time: new Date(0) },
      lastUpdatedTime: { time: new Date(0) }
    };

    tokenBalances.push(emptyEtherBalance);
  }

  return tokenBalances;
}

type BaseTokenBalanceInput = {
  address: string;
  network?: TokenFilter['network'];
};

type TokenBalanceInput = Omit<BaseTokenBalanceInput, 'network'> & TokenFilter;

type EthreumTokenBalanceInput = BaseTokenBalanceInput & Omit<TokenFilter, 'network'>;

export async function getTokenBalanceForAddress({
  address,
  network,
  contractAddress,
  tokenId
}: TokenBalanceInput): Promise<any> {
  const command = new GetTokenBalanceCommand({
    ownerIdentifier: {
      address
    },
    tokenIdentifier: {
      network,
      tokenId,
      contractAddress
    }
  });

  try {
    const balanceResponse = await callChainQuery(command);

    return balanceResponse.balance;
  } catch (error) {
    if (error?.['$metadata']?.httpStatusCode === 404) {
      return 0;
    } else {
      return Promise.reject(error);
    }
  }
}

export function getBitcoinBalanceForAddress({ address, network }: BaseTokenBalanceInput) {
  if (!network) {
    network = 'BITCOIN_MAINNET';
  }

  return getTokenBalanceForAddress({ address, network, tokenId: 'btc' });
}

export function getEtherBalanceForAddress({ address, network }: BaseTokenBalanceInput) {
  if (!network) {
    network = 'ETHEREUM_MAINNET';
  }

  return getTokenBalanceForAddress({ address, network, tokenId: 'eth' });
}

export function getEthereumTokenBalanceForAddress({
  address,
  network,
  contractAddress,
  tokenId
}: EthreumTokenBalanceInput) {
  if (!network) {
    network = 'ETHEREUM_MAINNET';
  }

  return getTokenBalanceForAddress({ address, network, contractAddress, tokenId });
}

export async function batchGetTokenBalances(tokenBalanceInputs: TokenBalanceInput[]) {
  const command = new BatchGetTokenBalanceCommand({
    getTokenBalanceInputs: tokenBalanceInputs.map(
      ({ address, network, tokenId, contractAddress }) => {
        return {
          ownerIdentifier: {
            address
          },
          tokenIdentifier: {
            network,
            tokenId,
            contractAddress
          }
        };
      }
    )
  });

  const balanceResponse = await callChainQuery(command);

  if (balanceResponse.errors?.length) {
    console.error('Error fetching some token balances', balanceResponse.errors);

    // Set balances to 0 for addresses with errors

    for (const balanceError of balanceResponse.errors) {
      const emptyBalance: TokenBalance = {
        balance: '0',
        tokenIdentifier: balanceError.tokenIdentifier,
        ownerIdentifier: balanceError.ownerIdentifier,
        atBlockchainInstant: { time: new Date(0) },
        lastUpdatedTime: { time: new Date(0) }
      };

      balanceResponse.tokenBalances.push(emptyBalance);
    }
  }

  return balanceResponse.tokenBalances;
}

export function batchGetBitcoinBalance(bitcoinBalanceInputs: BaseTokenBalanceInput[]) {
  return batchGetTokenBalances(
    bitcoinBalanceInputs.map(({ address, network }) => {
      if (!network) {
        network = 'BITCOIN_MAINNET';
      }

      return {
        address,
        network,
        tokenId: 'btc'
      };
    })
  );
}

export function batchGetEtherBalance(etherBalanceInputs: BaseTokenBalanceInput[]) {
  return batchGetTokenBalances(
    etherBalanceInputs.map(({ address, network }) => {
      if (!network) {
        network = 'ETHEREUM_MAINNET';
      }

      return {
        address,
        network,
        tokenId: 'eth'
      };
    })
  );
}

export function getAmbQueryTokenId({ network, tokenId, contractAddress }: TokenFilter) {
  return `${network}-${tokenId}-${contractAddress}`;
}
