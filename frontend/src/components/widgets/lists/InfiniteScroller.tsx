import { Box, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CSSProperties, ReactNode } from 'react';

type InfiniteScrollerProps = {
  isLoading: boolean;
  items: unknown[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  style?: CSSProperties;
  children: ReactNode;
};

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({
  isLoading,
  items,
  loadMore,
  hasMore,
  style = {},
  children
}: InfiniteScrollerProps) => {
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<></>}
      style={style}
    >
      {children}
      {isLoading && (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress />
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default InfiniteScroller;
