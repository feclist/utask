import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import initStore, { history } from './config/store'
import { ConnectedRouter } from 'connected-react-router'

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
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </MuiThemeProvider>
      </ConnectedRouter>
    </Provider>
  </React.Fragment>,
  document.getElementById('root')
)
registerServiceWorker()
