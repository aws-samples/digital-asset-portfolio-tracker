import { CachedTwoTone } from '@mui/icons-material';
import { CircularProgress, Alert, Stack, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type BalanceProps = {
  balance: ReactNode;
  balanceSuffix?: ReactNode;
  balanceNoun: string;
  isLoading: boolean;
  isPolling: boolean;
  error: null | Error;
  onRefresh?: () => Promise<void>;
};

export default function Balance({
  balance,
  balanceSuffix,
  balanceNoun,
  isLoading,
  isPolling,
  error,
  onRefresh
}: BalanceProps) {
  if (balance === null && isLoading && !isPolling) {
    return (
      <Box display='flex' alignItems='center' justifyContent='center'>
        <CircularProgress />
      </Box>
    );
  }

  const onRefreshClick = () => {
    if (onRefresh) {
      return onRefresh();
    }
  };

  const refreshIconSx = (isLoading || isPolling) && {
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(360deg)'
      },
      '100%': {
        transform: 'rotate(0deg)'
      }
    },
    cursor: 'pointer'
  };

  return (
    <Stack flexWrap='wrap' direction='column' alignItems='center' justifyContent='center'>
      {balance !== null && (
        <Stack flexWrap='wrap' direction='row' alignItems='center' justifyContent='center' gap={2}>
          <Stack>
            <Stack
              direction='row'
              gap={0.5}
              alignItems='center'
              sx={{ color: 'text.secondary' }}
              onClick={onRefreshClick}
            >
              <Typography
                variant='caption'
                alignItems='center'
                sx={onRefresh && { cursor: 'pointer' }}
              >
                {balanceNoun}
              </Typography>
              {onRefresh && <CachedTwoTone fontSize='small' sx={refreshIconSx} />}
            </Stack>
            <Typography variant='h3' noWrap sx={{ textAlign: 'center', maxWidth: '100vw' }}>
              {balance}
            </Typography>
          </Stack>
          <Typography
            variant='h5'
            alignItems='center'
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            {balanceSuffix}
          </Typography>
        </Stack>
      )}
      {error && <Alert severity='error'>Could not load balance</Alert>}
    </Stack>
  );
}
