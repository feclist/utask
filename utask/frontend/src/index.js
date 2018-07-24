import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fff'
    }
  }
})

ReactDOM.render(
  <React.Fragment>
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
)
registerServiceWorker()
