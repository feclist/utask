import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import initStore from './config/store'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff'
    }
  }
})

const store = initStore()

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
)
registerServiceWorker()
