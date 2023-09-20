import { createContext, useReducer } from 'react';
import useCognitoCredentials from '../hooks/useCognitoCredentials';
import { useRunOnChange } from '../hooks/useRunOnChange';

type UserContextProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  error: null | Error;
};

type UserContextAction = {
  type: 'authenticate' | 'loading';
  payload: {
    isAuthenticated?: UserContextProps['isAuthenticated'];
    isLoading?: UserContextProps['isLoading'];
    user?: UserContextProps['user'];
    error?: UserContextProps['error'];
  };
};

const initialUserContext = { isLoading: true, isAuthenticated: false, user: null, error: null };

const UserContext = createContext<{
  userState: UserContextProps;
  setUserState: React.Dispatch<UserContextAction>;
}>({
  userState: initialUserContext,
  setUserState: () => null
});

const userStateReducer = (
  state: UserContextProps,
  { type, payload: { isAuthenticated, isLoading, user, error } }: UserContextAction
): UserContextProps => {
  switch (type) {
    case 'loading':
      return {
        ...state,
        isLoading: !!isLoading,
        error
      };
    case 'authenticate':
      return {
        ...state,
        isAuthenticated: !!isAuthenticated,
        isLoading: isLoading !== undefined ? isLoading : state.isLoading,
        user: user || null,
        error
      };
  }
};

/**
 * Get credentials for an anonymous user from a Cognito Identity Pool
 */
const UserContextProvider: React.FC<React.HTMLProps<HTMLElement>> = ({
  children
}: React.HTMLProps<HTMLElement>) => {
  const { isLoading, error, credentials } = useCognitoCredentials();
  const [state, setState] = useReducer(userStateReducer, {
    user: null,
    isLoading,
    isAuthenticated: !!credentials,
    error
  });

  useRunOnChange(async () => {
    setState({
      type: 'authenticate',
      payload: { user: { credentials }, isLoading, isAuthenticated: !!credentials, error }
    });
  }, [credentials, isLoading, error]);

  return (
    <UserContext.Provider value={{ userState: state, setUserState: setState }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
