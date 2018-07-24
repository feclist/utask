import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 40,
    borderTop: '5px solid #f171ab',
    outline: 'none'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

const StyledModal = ({ open, handleClose, title, children, classes }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <Typography variant="display1">{title}</Typography>
          {children}
        </div>
      </Paper>
    </Modal>
  )
}

StyledModal.propTypes = {}

export default withStyles(styles)(StyledModal)
