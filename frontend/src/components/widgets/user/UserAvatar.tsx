import { Avatar, AvatarProps, Tooltip } from '@mui/material';
import Blockies, { IdenticonProps } from 'react-blockies';
import { useAccountsSelected } from '../../../hooks/useAccountsSelected';

type BlockiesProps = Omit<IdenticonProps, 'seed'>;

interface UserAvatarProps extends AvatarProps {
  blockiesProps?: BlockiesProps;
  placement?:
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'top-end'
    | 'top-start'
    | undefined;
  network?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  blockiesProps,
  placement = 'bottom',
  sx,
  network = 'ethereum',
  ...avatarProps
}: UserAvatarProps) => {
  const [firstAccount] = useAccountsSelected();

  return (
    <Tooltip title={firstAccount.address} placement={placement}>
      <Avatar sx={sx} {...avatarProps}>
        <Blockies size={11} {...blockiesProps} seed={firstAccount.address} />
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
