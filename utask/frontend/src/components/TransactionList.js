import React, { Component } from 'react'
import Transaction from './Transaction'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import TaskDrawer from './TaskDrawer'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
})

class TransactionList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      drawerOpen: false,
      drawerTask: undefined,
      drawerTransaction: undefined
    }

    this.closeTaskDrawer = this.closeTaskDrawer.bind(this)
  }

  async componentDidMount() {
    console.log(this.props)
    const transactionResponse = await this.props.apiClient.me.wallet.transactions.list()
    console.log(transactionResponse)
    console.log(transactionResponse.transactions[0])
    this.setState({
      transactions: transactionResponse.transactions
    })
  }

  triggerTaskDrawer(transaction) {
    const taskResponse = this.props.apiClient.tasks
      .retrieve(transaction.task_id)
      .then(task => {
        console.log(task)
        this.setState({
          drawerTask: task,
          drawerTransaction: transaction
        })
      })
    this.setState({ drawerOpen: true })
  }

  closeTaskDrawer() {
    this.setState({ drawerOpen: false })
  }

  render() {
    const { classes, ...other } = this.props
    return (
      <div className={classes.root} style={this.props.style}>
        <List>
          {this.state.transactions.map(
            transaction =>
              transaction !== undefined && (
                <div key={transaction.id}>
                  <Transaction
                    transaction={transaction}
                    ostId={this.props.me.profile.ost_id}
                    triggerTaskDrawer={() =>
                      this.triggerTaskDrawer(transaction)
                    }
                  />
                  <Divider />
                </div>
              )
          )}
        </List>
        <TaskDrawer
          open={this.state.drawerOpen}
          onClose={this.closeTaskDrawer}
          task={this.state.drawerTask}
          transaction={this.state.drawerTransaction}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  apiClient: state.account.apiClient,
  me: state.account.me
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TransactionList))
