import { PaidTwoTone, HistoryTwoTone } from '@mui/icons-material';
import TabStrip from './TabStrip';
import PortfolioTokenList from '../tokens/PortfolioTokenList';
import PortfolioTransactions from '../transactions/PortfolioTransactions';

export default function PortfolioTabs() {
  const tabs = [
    {
      id: 'assets',
      icon: <PaidTwoTone />,
      content: <PortfolioTokenList />
    },
    {
      id: 'transactions',
      icon: <HistoryTwoTone />,
      content: <PortfolioTransactions />
    }
  ];

  return <TabStrip tabs={tabs} variant='fullWidth' />;
}
