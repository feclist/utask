import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
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
    width: 400
  },
  nameContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  nameTextField: {
    width: 200 - theme.spacing.unit * 2
  }
})

class RegisterModal extends Component {
  state = {
    firstName: '',
    lastName: '',
    username: '',
    password1: '',
    password2: ''
  }
  render() {
    const { classes, ...other } = this.props
    return (
      <StyledModal {...other} title="REGISTER">
        <form className={classes.formContainer} noValidate>
          <div className={classes.nameContainer}>
            <TextField
              id="name"
              className={classes.nameTextField}
              value={this.state.firstName}
              margin="normal"
              label="First name"
            />
            <TextField
              id="name"
              className={classes.nameTextField}
              value={this.state.lastName}
              margin="normal"
              label="Last name"
            />
          </div>
          <TextField
            id="name"
            className={classes.textField}
            value={this.state.username}
            margin="normal"
            label="Username"
          />
          <TextField
            id="password-input"
            className={classes.textField}
            type="password"
            margin="normal"
            label="Password"
            value={this.state.password1}
          />
          <TextField
            id="password-input"
            className={classes.textField}
            type="password"
            margin="normal"
            label="Password (repeat)"
            value={this.state.password2}
          />
        </form>
        <Button variant="outlined" color="primary" className={classes.button}>
          SIGN UP
        </Button>
      </StyledModal>
    )
  }
}

RegisterModal.propTypes = {}

export default withStyles(styles)(RegisterModal)
