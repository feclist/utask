import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import UserDashboard from './UserDashboard'
import MarketPlace from './MarketPlace'
import DoTask from './DoTask'
import { retrieveMe } from './actions/account'
import { Route, Switch } from 'react-router'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import TaskCreation from './components/TaskCreation'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import ApiClient from './utils/ApiClient'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

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
    cursor: 'pointer',
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
    registerModalOpen: false,
    anchorEl: null
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

  handleAvatarClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  handleToDashboard = () => {
    this.props.push('/dashboard')
    this.handleMenuClose()
  }

  handleLogout = () => {
    this.props.apiClient.users.logout()
    this.handleMenuClose()
  }

  componentDidMount = () => {
    if (window.localStorage.token) {
      this.props.retrieveMe(this.props.apiClient)
      // TODO: DELETE THIS AFTER DEVELOPMENT
      window.apiClient = new ApiClient('/api')
    }
  }

  render() {
    const { classes, apiClient } = this.props
    const { anchorEl } = this.state
    return (
      <div className={classes.root}>
        <LoginModal
          apiClient={apiClient}
          open={this.state.loginModalOpen}
          handleClose={this.handleLoginClose}
        />
        <RegisterModal
          apiClient={apiClient}
          open={this.state.registerModalOpen}
          handleClose={this.handleRegisterClose}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}
        >
          <MenuItem onClick={this.handleToDashboard}>Dashboard</MenuItem>
          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        </Menu>
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Grid container spacing={24}>
              <Grid item xs={4}>
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.props.push('/create')}
                  >
                    Create task
                  </Button>
                  <Button
                    color="primary"
                    className={classes.button}
                    onClick={() => this.props.push('/marketplace')}
                  >
                    Marketplace
                  </Button>
                </div>
              </Grid>
              <Grid item xs={4}>
                <span
                  className={classes.title}
                  onClick={() => this.props.push('/')}
                >
                  µ t a s k
                </span>
              </Grid>
              <Grid item xs={4}>
                {window.localStorage.token ? (
                  <div
                    style={{
                      background: this.props.me
                        ? 'linear-gradient(-69deg, ' +
                          this.props.me.profile.top_color +
                          ', ' +
                          this.props.me.profile.bottom_color +
                          ')'
                        : '',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      margin: 'auto',
                      cursor: 'pointer'
                    }}
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleAvatarClick}
                  >
                    <Avatar className={classes.avatarIcon}>
                      {this.props.me &&
                        this.props.me.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                ) : (
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
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <div className={classes.pageContainer}>
          <Switch>
            <Route exact path="/" render={() => <div>HOMEPAGE</div>} />
            <Route path="/marketplace" render={() => <MarketPlace />} />
            <Route path="/create" render={() => <TaskCreation />} />
            <Route path="/dashboard" render={() => <UserDashboard />} />
            <Route path="/do/:taskId" component={DoTask} />
          </Switch>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  apiClient: state.account.apiClient,
  me: state.account.me
})

const mapDispatchToProps = dispatch => ({
  retrieveMe: apiClient => dispatch(retrieveMe(apiClient)),
  push: url => dispatch(push(url))
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(App))
)
