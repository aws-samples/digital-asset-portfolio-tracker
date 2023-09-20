import { Outlet } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { useAppState } from './hooks/useAppState';
import LandingPage from './components/layout/LandingPage';
import AddAccount from './components/widgets/settings/accounts/AddAccount';
import { CircularProgress, Container } from '@mui/material';
import ViewError from './components/views/Error';
import useCurrentRoute from './hooks/useCurrentRoute';
import { useAccountsSelected } from './hooks/useAccountsSelected';

export default function App() {
  const { isInitialized, isLoading, error } = useAppState();
  const selectedAccounts = useAccountsSelected();
  const route = useCurrentRoute();

  if ((!error && !isInitialized) || isLoading) {
    return (
      <Container
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Container>
    );
  } else if (error) {
    return <ViewError error={error} />;
  }

  let content = <Outlet />;

  if (!selectedAccounts.length && route.requireAccount) {
    content = (
      <LandingPage>
        <AddAccount />
      </LandingPage>
    );
  }

  return <AppLayout>{content}</AppLayout>;
}
