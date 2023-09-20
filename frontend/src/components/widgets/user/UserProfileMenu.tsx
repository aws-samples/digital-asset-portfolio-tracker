import { Box, Button, Menu, MenuItem, MenuList } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import UserProfileIdentification from './UserProfileIdentification';
import { VIEW_SETTINGS_TABS } from '../../views/Settings';
import { idToTitle } from '../../../utility/strings';

const UserProfileMenu: React.FC = () => {
  const [elUserAvatarButton, setElUserAvatarButton] = useState<null | HTMLElement>(null);
  const showUserAvatartMenu = Boolean(elUserAvatarButton);

  const onUserAvatarButtonClick = ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => {
    setElUserAvatarButton(currentTarget);
  };

  const onUserAvatarMenuClose = () => {
    setElUserAvatarButton(null);
  };

  return (
    <Box display='flex' alignItems='center'>
      <Button sx={{ p: 0 }} onClick={onUserAvatarButtonClick}>
        <UserProfileIdentification />
      </Button>
      <MenuList>
        <Menu
          id='user-settings-menu'
          open={showUserAvatartMenu}
          anchorEl={elUserAvatarButton}
          onClose={onUserAvatarMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {VIEW_SETTINGS_TABS.map(({ id, icon }) => {
            return (
              <MenuItem
                key={id}
                onClick={onUserAvatarMenuClose}
                component={Link}
                to={`/settings/#${id}`}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                {icon}
                <span>{idToTitle(id)}</span>
              </MenuItem>
            );
          })}
        </Menu>
      </MenuList>
    </Box>
  );
};

export default UserProfileMenu;
