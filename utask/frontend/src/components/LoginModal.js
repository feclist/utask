import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Lock from '@material-ui/icons/Lock'
import StyledModal from './StyledModal'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
    width: 250
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    width: 250
  }
})

class LoginModal extends Component {
  state = {
    name: '',
    password: ''
  }
  render() {
    const { classes, ...other } = this.props
    return (
      <StyledModal {...other} title="SIGN IN">
        <form className={classes.formContainer} noValidate>
          <TextField
            id="name"
            className={classes.textField}
            value={this.state.name}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              )
            }}
          />
          <TextField
            id="password-input"
            className={classes.textField}
            type="password"
            autoComplete="current-password"
            margin="normal"
            value={this.state.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              )
            }}
          />
        </form>
        <Button variant="outlined" color="primary" className={classes.button}>
          SIGN IN
        </Button>
      </StyledModal>
    )
  }
}

LoginModal.propTypes = {}

export default withStyles(styles)(LoginModal)
