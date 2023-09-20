import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export function useUser() {
  const { userState } = useContext(UserContext);

  return userState;
}
