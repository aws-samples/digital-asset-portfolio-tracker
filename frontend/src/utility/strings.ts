import { capitalize } from '@mui/material';

export function truncateAddressString(address: string, lengthFront = 6, lengthBack = 4) {
  const stringLength = address.length;
  const firstPart = address.substring(0, lengthFront);
  const lastPart = address.substring(stringLength - lengthBack, stringLength);

  return `${firstPart}...${lastPart}`;
}

export function hexStringToNumber(hexString: string) {
  return parseInt(hexString, 16);
}

export function hyphenToSpace(string: string) {
  return string.replace(/-/g, ' ');
}

export function pathToName(string: string) {
  const pathName = string.replace(/^\/+/, '');
  const name = capitalize(hyphenToSpace(pathName.toLowerCase()));

  return name || 'Home';
}

export function idToTitle(string: string) {
  return hyphenToSpace(string).split(' ').map(capitalize).join(' ');
}

export function viewNameToComponentName(string: string) {
  return string.replace(/ /g, '');
}
