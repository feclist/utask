import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '../../node_modules/@material-ui/core';
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { retrieveMe } from '../actions/account'
import MutBalance from './MutBalance';


const styles = theme => ({
    root: {
        marginTop: 12,
        margin: 'auto',
    }
})

class Wallet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            wallet: undefined,
        }
    }

    async componentDidMount() {
        const response = await this.props.apiClient.me.wallet.retrieve()
        if (response.balance !== undefined) this.setState({wallet: response.balance})
    }

    render() {
        console.log(this.state.balance)
        return (
            <div>
                <Typography variant='title'>Wallet details</Typography>
                <p></p><MutBalance amount={this.state.balance && this.state.balance.available_balance} />
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withStyles(styles)(Wallet))
)