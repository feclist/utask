import React, { Component } from 'react'
import Transaction from './Transaction'
import TaskDrawer from './TaskDrawer'
import {
  withStyles,
  Divider,
  Typography
} from '../../node_modules/@material-ui/core'
import List from '@material-ui/core/List'
import TaskCard from './TaskCard'
import TaskWrapper from './TaskWrapper'
import TaskDetail from './TaskDetail'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  dividerText: {
    color: 'gray',
    fontSize: '14px',
    display: 'block',
    margin: '12px',
    marginTop: '30px'
  },
  listWrapper: {
    display: 'block',
    margin: 'auto',
    width: 635
  }
})

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      live_tasks: [],
      completed_tasks: []
    }
  }

  async componentDidMount() {
    const taskResponse = await this.props.apiClient.tasks.userTasks()
    this.setState({
      live_tasks: taskResponse.live_tasks.map(task => {
        task.activeForUser = true
        return task
      }),
      completed_tasks: taskResponse.completed_tasks
    })
  }

  render() {
    const { classes, ...other } = this.props
    return (
      <div className={classes.root} style={this.props.style}>
        <span className={classes.dividerText}>Active tasks</span>
        <Divider />
        <div className={classes.listWrapper}>
          {this.state.live_tasks.map(
            task =>
              task !== undefined && (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDoTask={() => this.onDoTask(task.id)}
                  loading={this.state.loadingTask === task.id}
                />
              )
          )}
        </div>
        <span className={classes.dividerText}>Completed tasks</span>
        <Divider />
        <div className={classes.listWrapper}>
          {this.state.completed_tasks.map(
            task =>
              task !== undefined && (
                <TaskWrapper key={task.id}>
                  <TaskDetail task={task} />
                </TaskWrapper>
              )
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apiClient: state.account.apiClient
})

export default connect(mapStateToProps)(withStyles(styles)(TaskList))
