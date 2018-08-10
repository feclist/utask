import React, { Component } from 'react'
import TaskCard from './components/TaskCard'
import { Snackbar } from '../node_modules/@material-ui/core'
import { connect } from 'react-redux'
import { retrieveMe } from './actions/account'
import { push } from 'connected-react-router'

class MarketPlace extends Component {
  constructor(props) {
    super(props)

    this.onDoTask = this.onDoTask.bind(this)
    this.handleSnackClose = this.handleSnackClose.bind(this)
  }
  state = {
    loadingTask: -1,
    snackOpen: false,
    snackMsg: '',
    fake_tasks: [
      {
        id: 1,
        created_time: '2018-07-22T21:59:56.707430Z',
        end_time: '2018-07-22T22:04:59.413013Z',
        description:
          'Like and follow Barzz400 on SoundCloud to give him some traction and get his rap-carreer moving.',
        reward: 5.0,
        title: 'Like Barzz400 on SoundCloud',
        type: 'Anon',
        total_cost: 25,
        amount: 5,
        active: false,
        user: 1,
        completions: [1, 2, 3],
        live_tasks: [123]
      },
      {
        id: 2,
        created_time: '2018-08-18T21:59:56.707430Z',
        end_time: '2018-08-12T09:04:59.413013Z',
        description:
          "DefinitelyNotACryptoMiner wants you to grab a digital pickaxe and mine some ores for them. \"It's not for mining crypto, don't worry about it\" says DNACM CEO, Rich Bastardious while holding four 1080Ti's in his hands.",
        reward: 4.0,
        title: 'Click this pickaxe and mine some ores',
        type: 'Anon',
        total_cost: 800,
        amount: 200,
        active: false,
        user: 2,
        completions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        live_tasks: [123, 243]
      }
    ],
    tasks: []
  }

  async fetchTaskList() {
    const { apiClient, me } = this.props
    const tasks = await apiClient.tasks.list()
    const ownTasks = await apiClient.me.tasks.list()
    const { completed_tasks } = await apiClient.tasks.userTasks()
    tasks.map(task => {
      task.activeForUser =
        task.live_tasks.map(l_task => l_task.user).indexOf(me.id) !== -1
      return task
    })
    const otherOnesTasks = tasks.filter(
      task => ownTasks.map(ownTasks => ownTasks.id).indexOf(task.id) === -1
    )
    const notDoneTasks = otherOnesTasks.filter(
      task =>
        completed_tasks
          .map(completedTask => completedTask.id)
          .indexOf(task.id) === -1
    )
    this.setState({
      tasks: notDoneTasks
    })
  }

  componentDidMount() {
    const { apiClient, me, retrieveMe } = this.props
    if (me != null) {
      this.fetchTaskList()
    } else {
      retrieveMe(apiClient)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.me !== prevProps.me) {
      this.fetchTaskList()
    }
  }

  toDoTask(taskId) {
    this.props.push(`/do/${taskId}`)
  }

  async onDoTask(taskId) {
    this.setState({ loadingTask: taskId })

    const liveTask = await this.props.apiClient.tasks.startTask(taskId)
    if (liveTask.id) {
      this.toDoTask(taskId)
    } else {
      this.setState({
        loadingTask: -1,
        snackOpen: true,
        snackMsg: liveTask.message
      })
    }
  }

  handleSnackClose() {
    this.setState({
      snackOpen: false
    })
  }

  render() {
    return (
      <div>
        {this.state.tasks.map(
          task =>
            task !== undefined && (
              <TaskCard
                key={task.id}
                task={task}
                onDoTask={() => this.onDoTask(task.id)}
                onResume={() => this.toDoTask(task.id)}
                loading={this.state.loadingTask === task.id}
              />
            )
        )}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={this.state.snackOpen}
          autoHideDuration={4000}
          onClose={this.handleSnackClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.state.snackMsg}</span>}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apiClient: state.account.apiClient,
  me: state.account.me
})

const mapDispatchToProps = dispatch => ({
  retrieveMe: apiClient => dispatch(retrieveMe(apiClient)),
  push: url => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketPlace)
