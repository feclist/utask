import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
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
  const valueBuffer = value + (task.live_task.length / task.amount) * 100
  return { value, valueBuffer }
}

const TaskCard = ({ task, classes }) => {
  const linProValues = getLinearProgressValues(task)
  return (
    <Paper className={classes.root} elevation={4}>
      <div className={classes.titleLine}>
        <Typography variant="title">{task.title}</Typography>
        <MutBalance amount={task.reward} />
      </div>
      <Typography variant="subheading" gutterBottom>
        Finish by{' '}
        {moment
          .utc(task.end_time)
          .local()
          .format('HH:mm MMMM Do')}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {task.description}
      </Typography>
      <LinearProgress
        {...linProValues}
        variant="buffer"
        className={classes.progress}
      />
      <Button variant="outlined" color="primary" className={classes.button}>
        Do task
      </Button>
    </Paper>
  )
}

TaskCard.propTypes = {}

export default withStyles(styles)(TaskCard)
