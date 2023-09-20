import { createContext, useState } from 'react';
import { Account } from '../types/accounts';
import { Transaction, TransactionMap, TransactionNextTokenMap } from '../types/transactions';
import {
  getBitcoinTransactionsForAddress,
  getEthereumTransactionsForAddress
} from '../services/transactions';
import { useAccountsSelectedBitcoin } from '../hooks/useAccountsSelectedBitcoin';
import { useAccountsSelectedEthereum } from '../hooks/useAccountsSelectedEthereum';

type TransactionContextProps = {
  isLoading: boolean;
  isPolling: boolean;
  error: Error | null;
  transactionMap: TransactionMap;
  transactionsNextTokenMap: TransactionNextTokenMap;
  transactions: Transaction[];
  fetchTransactionsForAccounts: (refresh?: boolean) => Promise<void>;
};

export const TransactionContext = createContext<TransactionContextProps>(null);

export const TransactionContextProvider: React.FC<React.HTMLProps<HTMLElement>> = ({
  children
}: React.HTMLProps<HTMLElement>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactionMap, setTransactionMap] = useState<TransactionMap>(new Map());
  const [transactionsNextTokenMap, setTransactionsNextTokenMap] = useState<TransactionNextTokenMap>(
    new Map()
  );

  const bitcoinAccounts = useAccountsSelectedBitcoin();
  const ethereumAccounts = useAccountsSelectedEthereum();

  /**
   * Uses AMB Query to fetch Transactions and Transaction Events for the user's accounts
   */
  const fetchTransactionsForAccounts = async () => {
    const isFirstLoad = !transactionMap.size;

    setIsLoading(isFirstLoad);
    setIsPolling(!isFirstLoad);

    const getTransactionsInput = ({ address }: Account) => ({
      address,
      nextToken: transactionsNextTokenMap.get(address)
    });

    let transactionResults = [];

    try {
      transactionResults = await Promise.all([
        Promise.all(
          bitcoinAccounts.map((account) =>
            getBitcoinTransactionsForAddress(getTransactionsInput(account))
          )
        ),
        Promise.all(
          ethereumAccounts.map((account) =>
            getEthereumTransactionsForAddress(getTransactionsInput(account))
          )
        )
      ]);

      for (const transactionResult of transactionResults) {
        for (const { transactions, nextToken } of transactionResult) {
          transactionsNextTokenMap.set(transactions[0].userAddress, nextToken);

          for (const transaction of transactions) {
            transactionMap.set(transaction.transactionHash, transaction);
          }
        }
      }

      setTransactionMap(new Map(transactionMap));
      setTransactionsNextTokenMap(new Map(transactionsNextTokenMap));
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
    setIsPolling(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        isLoading,
        isPolling,
        error,
        transactionMap,
        transactionsNextTokenMap,
        transactions: [...transactionMap.values()].sort(
          (transactionA, transactionB) =>
            +transactionB.transactionTimestamp - +transactionA.transactionTimestamp
        ),
        fetchTransactionsForAccounts
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
