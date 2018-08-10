import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import MutBalance from './MutBalance'

import moment from 'moment'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 600,
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2
  },
  titleLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing.unit,
    alignSelf: 'flex-end'
  },
  progress: {
    marginTop: theme.spacing.unit * 2
  }
})

const getLinearProgressValues = task => {
  const value = (task.completions.length / task.amount) * 100
  const valueBuffer = value + (task.live_tasks.length / task.amount) * 100
  return { value, valueBuffer }
}

const CompletedTask = ({ task, transaction, classes }) => {
  const linProValues = getLinearProgressValues(task)
  return (
    <div className={classes.root}>
      <div className={classes.titleLine}>
        <Typography variant="title">{task.title}</Typography>
        <MutBalance amount={task.reward} />
      </div>
      <Typography variant="subheading" gutterBottom>
        You completed this task on{' '}
        {moment
          .utc(transaction.timestamp)
          .local()
          .format('DD/MM/YYYY')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {task.description}
      </Typography>
    </div>
  )
}

CompletedTask.propTypes = {}

export default withStyles(styles)(CompletedTask)
