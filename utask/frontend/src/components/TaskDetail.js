import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import MutBalance from './MutBalance'

import moment from 'moment'

const styles = theme => ({
    titleLine: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2
    },
  })

const TaskDetail = ({ task, classes }) => {
    return (
        <div>
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
        </div>
    )
}

export default withStyles(styles)(TaskDetail)
