import { useState } from 'react';
import { useRunOnChange } from './useRunOnChange';
import { usePortfolioTokens } from './usePortfolioTokens';

export function usePortfolioBalance() {
  const { isLoading, isPolling, error, tokens, fetchTokensForAccounts } = usePortfolioTokens();
  const [balance, setBalance] = useState(null);

  useRunOnChange(() => {
    if (tokens.some(({ balanceUsd }) => balanceUsd !== null)) {
      setBalance(
        tokens.reduce((total, token) => {
          return total + token.balanceUsd ?? 0;
        }, 0)
      );
    }
  }, tokens);

  return { isLoading, isPolling, error, balance, refresh: fetchTokensForAccounts };
}
