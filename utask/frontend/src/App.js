import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import MarketPlace from './MarketPlace'
import { retrieveMe } from './actions/account'
import { Route, Switch } from 'react-router'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'

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
    fontSize: 36,
    cursor: 'pointer',
    fontFamily: 'Shree714',
    background: '-webkit-linear-gradient(293deg, #f171ab, #f35f5f)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
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

  componentDidMount = () => {
    if (window.localStorage.token) {
      this.props.retrieveMe(this.props.apiClient)
    }
  }

  render() {
    const { classes, apiClient } = this.props
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
              <Button
                color="primary"
                className={classes.button}
                onClick={() => this.props.push('/marketplace')}
              >
                Marketplace
              </Button>
            </div>
            <span
              onClick={() => this.props.push('/')}
              className={classes.title}
            >
              µ t a s k
            </span>
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
          </Toolbar>
        </AppBar>
        <div className={classes.pageContainer}>
          <Switch>
            <Route exact path="/" render={() => <div>HOMEPAGE</div>} />
            <Route path="/marketplace" render={() => <MarketPlace />} />
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
  user: state.account.me
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
