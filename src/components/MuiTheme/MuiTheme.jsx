import { createMuiTheme } from '@material-ui/core';

const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#35baf6',
    },
    secondary: {
      main: '#33eb91',
    },
  },
  typography: {
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeightLight: 100,
    fontWeightRegular: 300,
    fontWeightMedium: 300,
    fontWeightBold: 400,
    h2: {
      fontFamily: 'Mulish',
      fontWeight: 200,
      letterSpacing: '0.1em',
    },
    h4: {
      fontFamily: 'Mulish',
      fontSize: '1.5em',
      fontWeight: 200,
      letterSpacing: '0.1em',
    },
    h5: {
      fontFamily: 'Mulish',
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
  },
});

export default MuiTheme;
