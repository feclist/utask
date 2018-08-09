import React, { Component } from 'react'
import Transaction from './Transaction'
import { withStyles, Divider } from '../../node_modules/@material-ui/core'
import List from '@material-ui/core/List'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper
  }
})

class TransactionList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      me: undefined
    }
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

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <List>
          {this.state.transactions.map(
            transaction =>
              transaction !== undefined && (
                <div>
                  <Transaction
                    key={transaction.id}
                    transaction={transaction}
                    ostId={this.props.me.profile.ost_id}
                  />
                  <Divider />
                </div>
              )
          )}
        </List>
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
