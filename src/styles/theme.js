import { createMuiTheme } from '@material-ui/core/styles';
require('typeface-montserrat');

export default createMuiTheme({
  palette: {
    primary: {
      light: '#855DB5',
      main: '#151515',
      dark: '#260857',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#65E4FF',
      main: '#19B2CC',
      dark: '#00829B',
      contrastText: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: 'Montserrat'
  }
});
