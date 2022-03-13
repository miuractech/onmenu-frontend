import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import {  MuiThemeProvider } from '@material-ui/core';
import { createTheme  } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
const THEME = createTheme ({
  typography: {
   "fontFamily": `'Poppins', sans-serif`,
    'button': {
      textTransform: "none"
    }
  },
  breakpoints:{
    values:{
      sm:400
    }
  }
});

ReactDOM.render(
  <React.Fragment>
    <MuiThemeProvider theme={THEME} >
    <Provider store={store}>
      <App />
    </Provider>
    </MuiThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
