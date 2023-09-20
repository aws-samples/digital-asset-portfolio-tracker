import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useAppState() {
  return useContext(AppContext);
}
