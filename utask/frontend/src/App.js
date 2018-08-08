import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import UserDashboard from './UserDashboard'
import MarketPlace from './MarketPlace'
import ApiClient from './utils/ApiClient';
import TransactionList from './components/TransactionList';
import TaskCreation from './components/TaskCreation';
import { Avatar, Grid } from '../node_modules/@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  pageContainer: {
    display: 'block',
    margin: 'auto',
    width: 1000
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
  title: {
    textAlign: 'center',
    display: 'block',
    fontSize: 36,
    fontFamily: 'Shree714',
    background: '-webkit-linear-gradient(293deg, #f171ab, #f35f5f)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  avatarIcon: {
    background: 'none'
  },
  '@font-face': {
    fontFamily: 'Shree714',
    src: 'url(fonts/Shree714.ttf)'
  }
})

class App extends Component {
  state = {
    loginModalOpen: false,
    registerModalOpen: false
  }

  handleLoginOpen = () => {
    this.setState({ loginModalOpen: true })
  }

  handleLoginClose = () => {
    this.setState({ loginModalOpen: false })
  }

  handleRegisterOpen = () => {
    this.setState({ registerModalOpen: true })
  }

  handleRegisterClose = () => {
    this.setState({ registerModalOpen: false })
  }

  componentWillMount = () => {
    window.apiClient = new ApiClient('/api')
    window.apiClient.me.retrieve().then((response) => {
      this.setState({ me: response })
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <LoginModal
          open={this.state.loginModalOpen}
          handleClose={this.handleLoginClose}
        />
        <RegisterModal
          open={this.state.registerModalOpen}
          handleClose={this.handleRegisterClose}
        />
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Grid container spacing={24}>
              <Grid item xs={4}>
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
              </Grid>
              <Grid item xs={4}>
                <span className={classes.title}>µ t a s k</span>
              </Grid>
              <Grid item xs={4}>
                {window.localStorage.token ?
                  <div style={{
                    background: this.state.me ? 'linear-gradient(-69deg, ' + this.state.me.profile.top_color + ', ' + this.state.me.profile.bottom_color + ')' : '',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    margin: 'auto',
                  }}>
                    <Avatar className={classes.avatarIcon}>{this.state.me && this.state.me.username.charAt(0).toUpperCase()}</Avatar>
                  </div>
                  :
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
                      onClick={this.handleRegisterOpen}
                    >
                      Get started
                </Button>
                  </div>
                }
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className={classes.pageContainer}>
          <UserDashboard />
          {/* <TaskCreation />
          <MarketPlace /> */}
          {/* <TransactionList /> */}
        </div>
        <div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App)
