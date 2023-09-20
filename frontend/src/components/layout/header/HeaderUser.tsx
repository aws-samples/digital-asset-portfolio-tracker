import { useAccountsSelected } from '../../../hooks/useAccountsSelected';
import UserProfileMenu from '../../widgets/user/UserProfileMenu';

export default function HeaderUser() {
  const selectedAccounts = useAccountsSelected();

  if (selectedAccounts.length) {
    return <UserProfileMenu />;
  }

  return null;
}
