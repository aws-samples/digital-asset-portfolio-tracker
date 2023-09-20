import {
  Alert,
  List,
  ListItemAvatar,
  ListItemProps,
  ListItemText,
  Stack,
  CircularProgress,
  Typography,
  Switch,
  FormControlLabel,
  ListItem
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import TokenAvatar from './TokenAvatar';
import LoadingList from '../lists/LoadingList';
import { formatNumber, formatUsd } from '../../../utility/internationalization';
import { PortfolioTokenBalances } from '../../../types/tokens';
import { useFetchPortfolioTokens } from '../../../hooks/useFetchPortfolioTokens';
import ButtonLogoCoinGecko from '../buttons/ButtonLogoCoinGecko';

type TokenListItemProps = ListItemProps & {
  id: string;
  name: string;
  icon: string;
  balance: string | null;
  balanceUsd: string | null;
  symbol: string;
  decimals: number;
  isLoading: boolean;
  error: Error | null;
};

function TokenListItem({
  id,
  name = 'Unknown',
  icon,
  balance,
  balanceUsd,
  symbol = 'Unknown',
  decimals,
  isLoading,
  error
}: TokenListItemProps) {
  let content = <></>;

  if (balance !== null) {
    content = (
      <Typography
        noWrap
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <ListItemText primary={name} secondary={`${formatNumber(balance, decimals)} ${symbol}`} />
        {balanceUsd !== null ? (
          <ListItemText sx={{ flex: 'none' }} primary={formatUsd(balanceUsd)} />
        ) : isLoading ? (
          <CircularProgress size={25} />
        ) : null}
      </Typography>
    );
  } else if (isLoading) {
    content = <CircularProgress />;
  } else if (error) {
    content = (
      <Alert severity='error'>Could not load {name} balance. Please refresh and try again.</Alert>
    );
  } else if (balance === null) {
    content = <ListItemText primary={name} secondary='Add account' />;
  }

  return (
    <li key={id}>
      <ListItem
        sx={{
          borderRadius: 1,
          bgcolor: 'background.paper',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto'
        }}
      >
        <ListItemAvatar>
          <TokenAvatar iconUrl={icon} />
        </ListItemAvatar>
        <Box flex={1}>{content}</Box>
      </ListItem>
    </li>
  );
}

export default function PortfolioTokenList() {
  // Group and sort tokens

  const { tokens, isLoading } = useFetchPortfolioTokens();

  const bitcoinBalances = tokens.filter(({ type }) => type == 'bitcoin');
  const etherBalances = tokens.filter(({ type }) => type == 'ether');
  const erc20UsdBalances = tokens
    .filter(({ type, balanceUsd }) => type == 'erc20' && balanceUsd !== null)
    .sort((assetA, assetB) => assetB.balanceUsd - assetA.balanceUsd);
  const erc20Balances = tokens.filter(
    ({ type, balanceUsd }) => type == 'erc20' && balanceUsd === null
  );

  const sortedAssetListItems: PortfolioTokenBalances[] = [
    ...bitcoinBalances,
    ...etherBalances,
    ...erc20UsdBalances,
    ...erc20Balances
  ];

  // Toggle visibility of unknown tokens

  const [showUnknown, setShowUnknown] = useState(false);

  const onToggleShowUnknown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowUnknown(event.target.checked);
  };

  return (
    <>
      <List sx={{ width: '100%' }}>
        <Stack gap={4}>
          {sortedAssetListItems.flatMap(
            ({
              id,
              balance,
              balanceUsd,
              name,
              isLoading: isLoadingToken,
              error,
              iconUrl,
              symbol,
              decimals
            }) => {
              if (!showUnknown && symbol.toLowerCase() == 'unknown') {
                return [];
              }

              return [
                <React.Fragment key={id}>
                  <TokenListItem
                    id={id}
                    icon={iconUrl}
                    name={name}
                    decimals={decimals}
                    balance={balance !== null ? balance.toString() : null}
                    balanceUsd={balanceUsd !== null ? balanceUsd.toString() : null}
                    symbol={symbol}
                    isLoading={isLoadingToken}
                    error={error}
                  />
                </React.Fragment>
              ];
            }
          )}
        </Stack>
      </List>
      {isLoading && <LoadingList />}
      {!!erc20UsdBalances.length && (
        <Box display='grid' gap={2} justifyContent='center'>
          <ButtonLogoCoinGecko>ERC20 token metadata provided by</ButtonLogoCoinGecko>
          {!isLoading && (
            <FormControlLabel
              control={
                <Switch
                  checked={showUnknown}
                  onChange={onToggleShowUnknown}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label='Show balances of unknown ERC20 tokens'
            />
          )}
        </Box>
      )}
    </>
  );
}
