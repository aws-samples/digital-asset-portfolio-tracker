import {
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton
} from '@mui/material';

interface LoadingListProps {
  items?: number;
}

const LoadingList: React.FC<LoadingListProps> = ({ items = 5 }: LoadingListProps) => {
  return (
    <List>
      <Stack gap={4}>
        {[...Array(items).keys()].map((_, i) => {
          return (
            <ListItem key={i} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              <ListItemAvatar>
                <Avatar>
                  <Skeleton animation='wave' variant='circular' />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton animation='wave' width='4em' />}
                secondary={<Skeleton animation='wave' width='6em' />}
              />
            </ListItem>
          );
        })}
      </Stack>
    </List>
  );
};

export default LoadingList;
