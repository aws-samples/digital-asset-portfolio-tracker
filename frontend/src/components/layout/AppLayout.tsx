import { Container } from '@mui/material';
import Header from './header/Header';
import Workspace from './Workspace';
import React from 'react';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export default function AppLayout({ children }: React.HTMLProps<HTMLElement>) {
  // Always scroll back to the top of the page when routing

  useScrollToTop();

  return (
    <Container disableGutters sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Workspace sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Workspace>
    </Container>
  );
}
