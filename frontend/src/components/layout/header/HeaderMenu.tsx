import { Divider, Drawer, Stack } from '@mui/material';
import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import HeaderUser from './HeaderUser';

type HeaderMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * The menu that contains the collapsed header content
 */
const HeaderMenu: React.FC<HeaderMenuProps> = ({ isOpen, onClose }: HeaderMenuProps) => {
  return (
    <Drawer
      variant='temporary'
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Better open performance on mobile
      }}
      onClick={onClose}
    >
      <Stack gap={2} sx={{ p: 4 }}>
        <HeaderLogo />
        <Divider />
        <HeaderNav />
        <Divider />
        <HeaderUser />
        <Divider />
      </Stack>
    </Drawer>
  );
};

export default HeaderMenu;
