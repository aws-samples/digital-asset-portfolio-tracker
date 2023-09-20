import { StackProps, Stack, ListItemIcon, ListItemText, List } from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import LinkedListItem from '../../widgets/lists/LinkedListItem';
import { appRoutes } from '../Router';
import { pathToName } from '../../../utility/strings';

/**
 * Component to pass to the List component that contains all link elements.
 */
const NavStack: React.FC<StackProps> = ({ children, ...stackProps }: StackProps) => {
  return (
    <Stack {...stackProps} component='nav'>
      {children}
    </Stack>
  );
};

/**
 * The navbar that shows in the header and header menu
 */
const HeaderNav: React.FC<StackProps> = (stackProps: StackProps) => {
  const headerRoutes = appRoutes.filter(({ showInHeader }) => showInHeader);
  const elRoutes = headerRoutes.map(({ name, path, icon }) => {
    const Icon = icon && MuiIcon[icon as keyof typeof MuiIcon];

    return (
      <LinkedListItem key={path} route={path} sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
          {Icon && <Icon color='primary' />}
        </ListItemIcon>
        <ListItemText primary={name || pathToName(path)} />
      </LinkedListItem>
    );
  });

  return (
    <List component={NavStack} sx={{ p: 0 }} {...stackProps}>
      {elRoutes}
    </List>
  );
};

export default HeaderNav;
