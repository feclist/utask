import React, { Component } from 'react'
import TaskDetail from './components/TaskDetail'
import TaskWrapper from './components/TaskWrapper'
import { connect } from 'react-redux'
import { retrieveMe } from './actions/account'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { push } from 'connected-react-router'

const styles = theme => ({
  root: {
    display: 'block',
    margin: 'auto'
  },
  button: {
    margin: theme.spacing.unit
  }
})

class DoTask extends Component {
  state = {
    task: null,
    liveTaskId: 0
  }

  async componentDidMount() {
    const { apiClient, match } = this.props
    const task = await apiClient.tasks.retrieve(match.params.taskId)
    this.setState({ task: task })
    const liveTask = await apiClient.tasks.retrieveFromTask(match.params.taskId)
    this.setState({ liveTask: liveTask })
  }

  finishTask = async () => {
    const response = await this.props.apiClient.tasks.finishTask(
      this.state.liveTask.id
    )
    this.props.push('/dashboard')
  }

  render() {
    const { classes } = this.props
    const { task } = this.state
    return (
      <div className={classes.root}>
        {task && (
          <TaskWrapper>
            <TaskDetail task={task} />
          </TaskWrapper>
        )}
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={this.finishTask}
        >
          Finish task
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apiClient: state.account.apiClient
})

const mapDispatchToProps = dispatch => ({
  push: url => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DoTask))
