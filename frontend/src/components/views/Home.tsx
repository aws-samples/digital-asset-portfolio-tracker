import { Stack } from '@mui/material';
import View, { ViewProps } from '../layout/View';
import ButtonLogoCoinGecko from '../widgets/buttons/ButtonLogoCoinGecko';
import PortfolioTabs from '../widgets/tabs/PortfolioTabs';
import PortfolioBalance from '../widgets/tokens/PortfolioBalance';

export default function ViewHome(props: ViewProps) {
  return (
    <View {...props}>
      <Stack gap={2} alignItems='center'>
        <PortfolioBalance />
        <ButtonLogoCoinGecko />
      </Stack>
      <PortfolioTabs />
    </View>
  );
}
