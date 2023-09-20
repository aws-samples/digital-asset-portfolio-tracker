import { createContext, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { initializeAmbQuery } from '../config/aws/amb-query';
import { useRunOnChange } from '../hooks/useRunOnChange';

type AppContextProps = {
  appName: string;
  appVersion: string;
  isInitialized: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
};

const initialAppContext = {
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: APP_VERSION,
  isInitialized: false,
  isLoading: true,
  isAuthenticated: false,
  error: null
};

const AppContext = createContext<AppContextProps>(initialAppContext);

const AppContextProvider: React.FC<React.HTMLProps<HTMLElement>> = ({
  children
}: React.HTMLProps<HTMLElement>) => {
  const { isLoading, isAuthenticated, user, error: errorLoadingUser } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(errorLoadingUser);

  // Once a user is authenticated, initialize the AMB Query SDK with their credentials

  useRunOnChange(() => {
    if (isAuthenticated && user) {
      try {
        initializeAmbQuery(user.credentials);

        setIsInitialized(true);
      } catch (err) {
        console.error(err);

        const error = new Error('Could not initialize AMB Query SDK');

        setError(error);
      }
    }
  }, isAuthenticated);

  useRunOnChange(() => {
    if (errorLoadingUser) {
      setError(errorLoadingUser);
    }
  }, errorLoadingUser);

  const { appName, appVersion } = initialAppContext;

  return (
    <AppContext.Provider
      value={{ appName, appVersion, isInitialized, isLoading, isAuthenticated, error }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
