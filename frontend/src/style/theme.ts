// Fonts

import './fonts';

// MUI Theme

import { ThemeOptions, createTheme } from '@mui/material';

const themeDefault: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF9900'
    },
    background: {
      default: '#161E2D',
      paper: '#232F3E'
    }
  },
  typography: {
    fontFamily: 'Hauora Sans'
  },
  spacing: 5,
  shape: {
    borderRadius: 3
  }
};

const theme = createTheme(themeDefault);

export default theme;
