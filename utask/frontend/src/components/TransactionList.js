import React, { Component } from 'react'
import Transaction from './Transaction'
import TaskDrawer from './TaskDrawer'
import { withStyles, Divider } from '../../node_modules/@material-ui/core';
import List from '@material-ui/core/List';


const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
})

class TransactionList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transactions: [],
            me: undefined,
            drawerOpen: false,
            drawerTask: undefined,
            drawerTransaction: undefined,
        }

        this.closeTaskDrawer = this.closeTaskDrawer.bind(this)
    }

    async componentDidMount() {
        const transactionResponse = await window.apiClient.me.wallet.transactions.list()
        const meResponse = await window.apiClient.me.retrieve()
        console.log(transactionResponse)
        console.log(transactionResponse.transactions[0])
        this.setState({ 
            transactions: transactionResponse.transactions,
            me: meResponse,
        })
    }

    triggerTaskDrawer(transaction) {
        const taskResponse = window.apiClient.tasks.retrieve(transaction.task_id).then((task) => {
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
            <div className={classes.root}>
                <List>
                    {this.state.transactions.map((transaction) =>
                        transaction !== undefined && 
                            <div>
                                <Transaction key={transaction.id} transaction={transaction} ostId={this.state.me.profile.ost_id} triggerTaskDrawer={() => this.triggerTaskDrawer(transaction)} />
                                <Divider />
                            </div>
                    )}
                </List>
                <TaskDrawer open={this.state.drawerOpen} onClose={this.closeTaskDrawer} task={this.state.drawerTask} transaction={this.state.drawerTransaction} />
            </div>
        )
    }
}

export default withStyles(styles)(TransactionList)