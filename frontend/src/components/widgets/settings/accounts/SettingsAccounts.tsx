import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import ButtonPrimary from '../../buttons/ButtonPrimary';
import { useContext, useState } from 'react';
import { clearAccountsCache } from '../../../../config/accounts';
import { AccountContext } from '../../../../context/AccountContext';
import AddAccount from './AddAccount';

/**
 * Allows a user to change the portfolio account
 */
const SettingsAccounts: React.FC = () => {
  const { setAccounts } = useContext(AccountContext);

  const [showClearAccountHistoryConfirm, setShowClearAccountHistoryConfirm] = useState(false);

  const onCloseClearAccountHistoryConfirm = () => {
    setShowClearAccountHistoryConfirm(false);
  };

  const onClearAccountHistory = () => {
    clearAccountsCache();

    setAccounts({ method: 'clearAccounts' });
  };

  return (
    <Stack gap={4}>
      <ButtonPrimary
        sx={{
          width: 'fit-content'
        }}
        startIcon={<Delete />}
        onClick={() => setShowClearAccountHistoryConfirm(true)}
      >
        Clear saved accounts
      </ButtonPrimary>
      <AddAccount />
      <Dialog open={showClearAccountHistoryConfirm} onClose={onCloseClearAccountHistoryConfirm}>
        <DialogTitle>{'Are you sure you want to clear your saved accounts?'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 4 }}>
          <Alert severity='warning'>
            Clearing your saved accounts will require you to reenter your wallet addresses
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseClearAccountHistoryConfirm}>No</Button>
          <Button
            onClick={() => {
              onClearAccountHistory();
              setShowClearAccountHistoryConfirm(false);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default SettingsAccounts;
