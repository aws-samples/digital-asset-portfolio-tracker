import { Paper, Stack, Typography, capitalize } from '@mui/material';
import { useAppState } from '../../hooks/useAppState';
import View, { ViewProps } from '../layout/View';
import ButtonLogoCoinGecko from '../widgets/buttons/ButtonLogoCoinGecko';

export default function ViewAbout(props: ViewProps) {
  const { appName, appVersion } = useAppState();

  return (
    <View {...props}>
      <Paper sx={{ p: 4 }}>
        <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='body1'>{capitalize(appName || '')}</Typography>
            <Typography variant='body2'>v{appVersion}</Typography>
          </Stack>
          <div style={{ display: 'flex' }}>
            <ButtonLogoCoinGecko>Price data and ERC20 token list provided by</ButtonLogoCoinGecko>
          </div>
        </div>
      </Paper>
    </View>
  );
}
