// This component contains a List that routes onclick of a ListItem

import { ListItemButton, ListItemButtonProps } from '@mui/material';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import React from 'react';

interface LinkedListItemProps extends ListItemButtonProps {
  route: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const LinkedListItem: React.FC<LinkedListItemProps> = ({
  route,
  children,
  sx
}: LinkedListItemProps) => {
  return (
    <li>
      <ListItemButton to={route} component={Link} sx={{ borderRadius: 1, ...sx }}>
        {children}
      </ListItemButton>
    </li>
  );
};

export default LinkedListItem;
