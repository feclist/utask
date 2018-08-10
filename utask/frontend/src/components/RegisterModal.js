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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  registerUser = async () => {
    const { username, firstName, lastName, password1, password2 } = this.state
    if (password1 === password2) {
      const form = {
        username,
        password: password1,
        first_name: firstName,
        last_name: lastName
      }
      const response = await this.props.apiClient.users.register(form)
      if ('token' in response) window.localStorage.token = response.token
      this.props.handleClose()
    }
  }

  render() {
    const { classes, ...other } = this.props
    return (
      <StyledModal {...other} title="REGISTER">
        <form className={classes.formContainer} noValidate>
          <div className={classes.nameContainer}>
            <TextField
              id="fname"
              className={classes.nameTextField}
              value={this.state.firstName}
              onChange={this.handleChange('firstName')}
              margin="normal"
              label="First name"
            />
            <TextField
              id="lname"
              className={classes.nameTextField}
              value={this.state.lastName}
              onChange={this.handleChange('lastName')}
              margin="normal"
              label="Last name"
            />
          </div>
          <TextField
            id="uname"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleChange('username')}
            margin="normal"
            label="Username"
          />
          <TextField
            id="password-input1"
            className={classes.textField}
            type="password"
            margin="normal"
            label="Password"
            value={this.state.password1}
            onChange={this.handleChange('password1')}
          />
          <TextField
            id="password-input2"
            className={classes.textField}
            type="password"
            margin="normal"
            label="Password (repeat)"
            value={this.state.password2}
            onChange={this.handleChange('password2')}
          />
        </form>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.registerUser}
        >
          SIGN UP
        </Button>
      </StyledModal>
    )
  }
}

RegisterModal.propTypes = {}

export default withStyles(styles)(RegisterModal)
