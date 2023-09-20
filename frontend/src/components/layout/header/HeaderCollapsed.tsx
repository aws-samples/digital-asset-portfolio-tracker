import { Box, IconButton } from '@mui/material';
import HeaderLogo from './HeaderLogo';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import HeaderMenu from './HeaderMenu';

/**
 * The main header of the app at mobile screen sizes
 */
const HeaderCollapsed: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Box width='100%' display='grid' alignItems='center' gridTemplateColumns='2.25em 1fr'>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={() => toggleMenuOpen()}
        >
          <MenuIcon />
        </IconButton>
        <HeaderLogo />
      </Box>
      <HeaderMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
};

export default HeaderCollapsed;
