import React from 'react';
import {
  Stack,
  ListItemAvatar,
  Avatar,
  Box,
  ListItemText,
  Typography,
  List,
  ListItem,
  Alert,
  Link
} from '@mui/material';
import { Transaction } from '../../../types/transactions';
import LoadingList from '../lists/LoadingList';
import { NETWORK_IDS } from '../../../types/accounts';
import { OpenInNewTwoTone } from '@mui/icons-material';
import { NETWORKS } from '../../../config/networks';

const TransactionListItem: React.FC<Transaction> = ({
  network,
  networkId,
  transactionHash,
  transactionId,
  type,
  valueFormatted,
  icon,
  iconColor
}: Transaction) => {
  let explorerUrl = '';

  if (networkId == NETWORK_IDS.BITCOIN) {
    explorerUrl = `${NETWORKS.bitcoin.explorerUrlTransaction}/${transactionId || transactionHash}`;
  } else if (networkId == NETWORK_IDS.ETHEREUM) {
    explorerUrl = `${NETWORKS.ethereum.explorerUrlTransaction}/${transactionHash}`;
  }

  return (
    <li key={transactionHash}>
      <ListItem
        sx={{
          borderRadius: 1,
          bgcolor: 'background.paper',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto'
        }}
      >
        <ListItemAvatar>
          <Avatar
            variant='rounded'
            sx={{
              bgcolor: iconColor,
              color: 'grey.50'
            }}
          >
            {icon}
          </Avatar>
        </ListItemAvatar>
        <Box display='flex' alignItems='center' sx={{ mr: 2 }}>
          <ListItemText
            primary={<span>{type}</span>}
            secondary={
              <Typography>
                {valueFormatted} {network.currency}
              </Typography>
            }
          />
          <Link href={explorerUrl} target={transactionHash}>
            <OpenInNewTwoTone />
          </Link>
        </Box>
      </ListItem>
    </li>
  );
};

type TransactionListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: null | Error;
};

/**
 * Renders a list of transactions
 */
const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  error
}: TransactionListProps) => {
  if (transactions.length) {
    return (
      <List sx={{ width: '100%' }}>
        <Stack gap={4}>
          {transactions.map((transaction) => {
            return <TransactionListItem key={transaction.transactionHash} {...transaction} />;
          })}
        </Stack>
      </List>
    );
  } else if (isLoading) {
    return <LoadingList />;
  } else if (error) {
    return <Alert severity='error'>Could not load transactions</Alert>;
  }

  return <Alert severity='info'>No transactions found</Alert>;
};

export default TransactionList;
