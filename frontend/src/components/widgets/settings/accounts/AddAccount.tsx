import { Autocomplete, Checkbox, TextField, capitalize } from '@mui/material';
import { useContext, useRef, useMemo } from 'react';
import { useRunOnce } from '../../../../hooks/useRunOnce';
import { useAccounts } from '../../../../hooks/useAccounts';
import { truncateAddressString } from '../../../../utility/strings';
import { AccountContext } from '../../../../context/AccountContext';
import { Account, AccountAutocompleteOption } from '../../../../types/accounts';
import { getNetworkFromAddress, getNetworkIdFromAddress } from '../../../../utility/networks';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { isAddressValid, postProcessAddressInput } from '../../../../utility/addresses';

/**
 * Renders an input the user can use to add an account to the app
 */
export default function AddAccount() {
  const { setAccounts } = useContext(AccountContext);
  const { accounts } = useAccounts();
  const elAddressInput = useRef<HTMLInputElement>(null);

  // Focus input on initial render

  useRunOnce(() => {
    elAddressInput.current?.focus();
  });

  // Get all existing and default accounts to add to the dropdown

  const selectOptions: AccountAutocompleteOption[] = accounts
    .map(({ address, name, isSelected }) => ({
      label: name,
      value: address,
      selected: isSelected
    }))
    .sort((optionA, optionB) => optionA.label.localeCompare(optionB.label));

  const selectedOptions = useMemo(
    () => selectOptions.filter((account) => account.selected),
    [selectOptions]
  );

  /**
   * Called on Autocomplete change, either when user updates the selections or enters a new text value
   */
  const onAutocompleteChange = (event, options) => {
    onAccountsSubmit(options.flatMap(autocompleteOptionToAccount));
  };

  /**
   * Takes an Autocomplete option and returns an Account with its address value if the address is valid.
   * The option will be a string if the user enters a new address via text entry,
   * else the option will be an AccountAutocompleteOption
   */
  const autocompleteOptionToAccount = (option: string | AccountAutocompleteOption): Account[] => {
    if (typeof option == 'string') {
      if (isAddressValid(option)) {
        option = postProcessAddressInput(option);

        // Create the account if its not already in the accounts list

        if (
          !accounts.some(({ address }) => address.toLowerCase() == (option as string).toLowerCase())
        ) {
          const networkId = getNetworkIdFromAddress(option);
          const networkName = getNetworkFromAddress(option);

          const account: Account = {
            name: `${capitalize(networkName)} Account ${
              accounts.filter(({ network }) => network == networkId).length + 1
            }`,
            address: option,
            network: networkId,
            isSelected: true
          };

          return [account];
        }

        return [];
      }

      // Not a valid address, show custom validity message on the Autocomplete input

      elAddressInput.current?.setCustomValidity('Only Ethereum and Bitcoin addresses supported');
      elAddressInput.current?.reportValidity();

      return [];
    }

    option.value = postProcessAddressInput(option.value);

    const account: Account = {
      name: option.label,
      address: option.value,
      network: getNetworkIdFromAddress(option.value),
      isSelected: true
    };

    return [account];
  };

  /**
   * Called when user submits selected accounts.
   * Updates the Account Context with their selections.
   */
  const onAccountsSubmit = (selectedAccounts: Account[]) => {
    if (selectedAccounts[0]?.address) {
      // Validate all account addresses

      if (selectedAccounts.every(({ address }) => isAddressValid(address))) {
        // Add each account to the Account Context

        for (const account of selectedAccounts) {
          setAccounts({ method: 'addAccount', payload: { account } });
        }
      } else {
        // At least one address is not valid, show custom validity message on the Autocomplete input

        elAddressInput.current?.setCustomValidity('Only Ethereum and Bitcoin addresses supported');
        elAddressInput.current?.reportValidity();
      }
    } else if (elAddressInput.current.checkValidity()) {
      elAddressInput.current?.setCustomValidity('At least one account must be selected');
      elAddressInput.current?.reportValidity();
    }

    // Update selected state of each account

    for (const account of accounts) {
      let isSelected = false;

      if (selectedAccounts.some(({ address }) => account.address == address)) {
        isSelected = true;
      }

      setAccounts({
        method: 'updateAccount',
        payload: { account: { ...account, isSelected } }
      });
    }
  };

  return (
    <Autocomplete
      open
      multiple
      freeSolo
      autoComplete
      options={selectOptions}
      value={selectedOptions}
      renderInput={(params) => (
        <TextField {...params} label='Enter Address' required inputRef={elAddressInput} />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize='small' />}
            checkedIcon={<CheckBox fontSize='small' />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {`${option.label} (${truncateAddressString(option.value, 8)})`}
        </li>
      )}
      onChange={onAutocompleteChange}
      onInputChange={() => {
        // Clear the custom validation message each time the input changes to ensure it always shows the correct validity message

        elAddressInput.current?.setCustomValidity('');
      }}
    />
  );
}
