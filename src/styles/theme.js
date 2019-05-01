import {createMuiTheme} from '@material-ui/core/styles';

require('typeface-montserrat');

export default createMuiTheme({
  palette: {
    primary: {
      light: '#855DB5',
      main: '#151515',
      dark: '#260857',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#F8E590',
      main: '#F1CB21',
      dark: '#D8B61D',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
});
