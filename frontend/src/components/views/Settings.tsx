import { AccountBalanceWallet } from '@mui/icons-material';
import { Divider, Paper, Stack, Typography } from '@mui/material';
import View, { ViewProps } from '../layout/View';
import TabStrip from '../widgets/tabs/TabStrip';
import SettingsAccounts from '../widgets/settings/accounts/SettingsAccounts';

type SettingsTabPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

/**
 * Used for each tab panel on the Settings View
 */
const SettingsTabPanel: React.FC<SettingsTabPanelProps> = ({
  title,
  description = '',
  children
}: SettingsTabPanelProps) => {
  return (
    <Stack gap={4} sx={{ p: 4 }}>
      <Typography variant='h5'>{title}</Typography>
      {description ? <Typography variant='subtitle1'>{description}</Typography> : null}
      <Divider />
      {children}
    </Stack>
  );
};

export const VIEW_SETTINGS_TABS = [
  {
    id: 'accounts',
    icon: <AccountBalanceWallet />,
    content: (
      <SettingsTabPanel
        title='Accounts'
        description='Update your portfolio accounts. Your selected accounts are used to fetch your assets.'
      >
        <SettingsAccounts />
      </SettingsTabPanel>
    )
  }
];

export default function ViewSettings(props: ViewProps) {
  return (
    <View {...props}>
      <TabStrip
        tabs={VIEW_SETTINGS_TABS}
        centered
        orientation='vertical'
        TabIndicatorProps={{
          sx: {
            left: 0
          }
        }}
        tabStripContainerSx={{
          flex: 1,
          display: 'grid',
          gap: 4,
          gridTemplateColumns: 'auto 1fr'
        }}
        TabPanelContainer={Paper}
      />
    </View>
  );
}
