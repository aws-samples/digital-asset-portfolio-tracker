import { Stack } from '@mui/material';
import HeaderLogo from './HeaderLogo';
import HeaderUser from './HeaderUser';
import HeaderNav from './HeaderNav';

/**
 * The main header of the app at desktop screen sizes
 */
const HeaderExpanded: React.FC = () => {
  return (
    <Stack
      direction='row'
      gap={2}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
      }}
    >
      <HeaderLogo />
      <HeaderNav direction='row' justifyContent='flex-end' flex={1} />
      <HeaderUser />
    </Stack>
  );
};

export default HeaderExpanded;
