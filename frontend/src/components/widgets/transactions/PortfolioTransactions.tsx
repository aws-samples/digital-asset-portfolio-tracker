import TransactionList from './TransactionList';
import { useTransactions } from '../../../hooks/useTransactions';
import InfiniteScroller from '../lists/InfiniteScroller';
import { useRunOnce } from '../../../hooks/useRunOnce';

/**
 * Renders a list of the portfolio's transactions
 */
export default function PorfolioTransactions() {
  const {
    isLoading,
    isPolling,
    error,
    transactions,
    transactionsNextTokenMap,
    fetchTransactionsForAccounts
  } = useTransactions();

  useRunOnce(fetchTransactionsForAccounts);

  return (
    <InfiniteScroller
      isLoading={isLoading || isPolling}
      items={transactions}
      loadMore={fetchTransactionsForAccounts}
      hasMore={!!transactionsNextTokenMap.size}
      style={{ overflow: 'none' }}
    >
      <TransactionList transactions={transactions} isLoading={isLoading} error={error} />
    </InfiniteScroller>
  );
}
