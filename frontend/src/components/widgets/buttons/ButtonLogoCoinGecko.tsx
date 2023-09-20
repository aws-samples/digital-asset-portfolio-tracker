import { Box, Link, Typography } from '@mui/material';
import logoCoinGecko from '/logo-coin-gecko.png';
import { OpenInNewTwoTone } from '@mui/icons-material';
import { ReactNode } from 'react';

type ButtonLogoCoinGeckoProps = {
  children?: ReactNode;
};

export default function ButtonLogoCoinGecko({ children }: ButtonLogoCoinGeckoProps) {
  return (
    <Link
      href='https://www.coingecko.com/'
      target='coin-gecko'
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <Typography variant='caption' noWrap>
        <Typography variant='caption' noWrap>
          {children || 'Price data provided by'}
        </Typography>
      </Typography>
      <Box component='img' src={logoCoinGecko} height={25} width='auto' />
      <OpenInNewTwoTone sx={{ fontSize: '1em' }} />
    </Link>
  );
}
