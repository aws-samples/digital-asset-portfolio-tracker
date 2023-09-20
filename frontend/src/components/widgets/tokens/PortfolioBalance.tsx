import { useRunOnce } from '../../../hooks/useRunOnce';
import { usePortfolioBalance } from '../../../hooks/usePortfolioBalance';
import { formatUsd } from '../../../utility/internationalization';
import Balance from './Balance';

export default function PortfolioBalance() {
  const { isLoading, isPolling, error, balance, refresh } = usePortfolioBalance();

  useRunOnce(() => {
    if (balance === null) {
      refresh(false);
    }
  });

  return (
    <Balance
      balance={balance === null ? balance : formatUsd(balance)}
      balanceNoun='Total balance'
      isLoading={isLoading}
      isPolling={isPolling}
      error={error}
      onRefresh={refresh}
    />
  );
}
