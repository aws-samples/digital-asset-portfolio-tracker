import { AppBar, Container, Toolbar } from '@mui/material';
import HeaderExpanded from './HeaderExpanded';
import HeaderCollapsed from './HeaderCollapsed';
import { useResponsiveLayout } from '../../../hooks/useResponsiveLayout';
import HeaderScroll from './HeaderScroll';

/**
 * The Header layout component sits at the top of the app
 */
const Header: React.FC = () => {
  const { shouldCollapseHeader } = useResponsiveLayout();

  return (
    <HeaderScroll>
      <AppBar position='sticky' color='transparent' sx={{ bgcolor: 'background.default' }}>
        <Container sx={{ py: 2 }}>
          <Toolbar>{shouldCollapseHeader ? <HeaderCollapsed /> : <HeaderExpanded />}</Toolbar>
        </Container>
      </AppBar>
    </HeaderScroll>
  );
};

export default Header;
