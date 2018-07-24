import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import LoginModal from './components/LoginModal'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: '#fff',
    boxShadow: '0 0px 0px 0px'
  },
  toolBar: {
    display: 'flex',
    width: 1040,
    margin: 'auto',
    justifyContent: 'space-between'
  },
  button: {
    margin: theme.spacing.unit
  },
  modalButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    width: 250
  },
  title: {
    fontSize: 36,
    fontFamily: 'Shree714',
    background: '-webkit-linear-gradient(293deg, #f171ab, #f35f5f)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  modalPaper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 40,
    borderTop: '5px solid #f171ab',
    outline: 'none'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    width: 250
  },
  '@font-face': {
    fontFamily: 'Shree714',
    src: 'url(fonts/Shree714.ttf)'
  }
})

class App extends Component {
  state = {
    loginModalOpen: false
  }

  handleLoginOpen = () => {
    this.setState({ loginModalOpen: true })
  }

  handleLoginClose = () => {
    this.setState({ loginModalOpen: false })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <LoginModal
          open={this.state.loginModalOpen}
          handleClose={this.handleLoginClose}
        />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <div>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
              >
                Create task
              </Button>
              <Button color="primary" className={classes.button}>
                Marketplace
              </Button>
            </div>
            <span className={classes.title}>µ t a s k</span>
            <div>
              <Button
                color="primary"
                className={classes.button}
                onClick={this.handleLoginOpen}
              >
                Sign in
              </Button>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
              >
                Get started
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App)
