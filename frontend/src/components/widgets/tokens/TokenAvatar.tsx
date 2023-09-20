import { QuestionMarkTwoTone } from '@mui/icons-material';
import { Avatar, AvatarProps } from '@mui/material';

interface TokenAvatarProps extends AvatarProps {
  iconUrl: string;
}

const TokenAvatar: React.FC<TokenAvatarProps> = ({ iconUrl, ...props }: TokenAvatarProps) => {
  return (
    <Avatar
      src={iconUrl}
      imgProps={{
        sx: {
          objectFit: 'contain'
        }
      }}
      {...props}
    >
      {!iconUrl ? <QuestionMarkTwoTone /> : null}
    </Avatar>
  );
};

export default TokenAvatar;
