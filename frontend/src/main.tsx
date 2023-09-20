import React from 'react';
import ReactDOM from 'react-dom/client';
import './style';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './style/theme.ts';
import { Toaster } from 'react-hot-toast';
import { InfoTwoTone, CheckCircleTwoTone, ErrorTwoTone } from '@mui/icons-material';
import { AccountContextProvider } from './context/AccountContext';
import Router from './components/layout/Router';
import { UserContextProvider } from './context/UserContext';
import { AppContextProvider } from './context/AppContext.tsx';
import { ConfirmProvider } from 'material-ui-confirm';
import { TokenContextProvider } from './context/TokenContext.tsx';
import { TransactionContextProvider } from './context/TransactionContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfirmProvider>
        <Toaster
          toastOptions={{
            style: {
              color: theme.palette?.text?.primary,
              background: theme.palette?.background?.paper,
              maxWidth: 550,
              wordBreak: 'break-word'
            },
            icon: <InfoTwoTone color='info' />,
            success: {
              icon: <CheckCircleTwoTone color='success' />
            },
            error: {
              icon: <ErrorTwoTone color='error' />
            }
          }}
        />
        <UserContextProvider>
          <AccountContextProvider>
            <AppContextProvider>
              <TokenContextProvider>
                <TransactionContextProvider>
                  <Router />
                </TransactionContextProvider>
              </TokenContextProvider>
            </AppContextProvider>
          </AccountContextProvider>
        </UserContextProvider>
      </ConfirmProvider>
    </ThemeProvider>
  </React.StrictMode>
);
