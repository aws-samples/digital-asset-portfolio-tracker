import { Typography } from '@mui/material';
import ButtonLogo from '../../widgets/buttons/ButtonLogo';
import { WalletTwoTone } from '@mui/icons-material';

const appName = import.meta.env.VITE_APP_NAME;

/**
 * The app logo and name that shows in the header
 */
const HeaderLogo: React.FC = () => {
  return (
    <ButtonLogo to='/'>
      <WalletTwoTone sx={{ fontSize: '2.5em' }} />
      <Typography variant='h6' noWrap>
        {appName}
      </Typography>
    </ButtonLogo>
  );
};

export default HeaderLogo;
