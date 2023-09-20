import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';
import { useRunOnce } from './useRunOnce';

export function useFetchPortfolioTokens() {
  const { fetchTokensForAccounts, ...tokensContext } = useContext(TokenContext);

  // Fetch tokens for accounts once on mount if not already being fetched

  useRunOnce(() => {
    if (!tokensContext.isLoading) {
      fetchTokensForAccounts(!!tokensContext.tokens.length);
    }
  });

  return tokensContext;
}
