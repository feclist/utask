import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import moment from 'moment'
import { CircularProgress } from '../../node_modules/@material-ui/core';

const styles = theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 600,
      padding: theme.spacing.unit * 2,
      margin: theme.spacing.unit * 2
    },
  })

const TaskWrapper = ({ children, classes }) => {
    return (
        <Paper className={classes.root} elevation={4}>
            {children}
        </Paper>
    )
}


export default withStyles(styles)(TaskWrapper)
