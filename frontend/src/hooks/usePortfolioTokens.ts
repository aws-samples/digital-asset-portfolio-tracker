import { useContext } from 'react';
import { TokenContext } from '../context/TokenContext';

export function usePortfolioTokens() {
  return useContext(TokenContext);
}
