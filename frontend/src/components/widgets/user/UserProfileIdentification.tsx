import { Stack } from '@mui/material';
import UserAvatar from './UserAvatar';
import { ArrowDropDown } from '@mui/icons-material';

export default function UserProfileIdentification() {
  return (
    <Stack direction='row' gap={2} alignItems='center'>
      <UserAvatar />
      <ArrowDropDown />
    </Stack>
  );
}
