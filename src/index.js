import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
} from '@material-ui/core/styles';
// import indexStyles from './index.css';
import theme from './styles/theme';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: document.getElementById('jss-insertion-point'),
});

ReactDOM.render(
  <BrowserRouter>
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </JssProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();
