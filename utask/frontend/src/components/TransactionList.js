import React, { Component } from 'react'
import Transaction from './Transaction'
import { withStyles, Divider } from '../../node_modules/@material-ui/core';
import List from '@material-ui/core/List';


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
})

class TransactionList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transactions: [],
            me: undefined,
        }
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

    render() {
        const { classes, ...other } = this.props
        return (
            <div className={classes.root}>
                <List>
                    {this.state.transactions.map((transaction) =>
                        transaction !== undefined && 
                            <div>
                                <Transaction key={transaction.id} transaction={transaction} ostId={this.state.me.profile.ost_id} />
                                <Divider />
                            </div>
                    )}
                </List>
            </div>
        )
    }
}

export default withStyles(styles)(TransactionList)