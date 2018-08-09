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
            effectiveFunds: 0,
        }
    }

    async componentDidMount() {
        const wallet = await this.props.apiClient.me.wallet.retrieve()
        const effectiveFunds = await this.props.apiClient.me.wallet.effectiveFunds()
        if (wallet.balance !== undefined) this.setState({ wallet: wallet.balance })
        if (effectiveFunds.effective_funds) this.setState({ effectiveFunds: effectiveFunds.effective_funds})
    }

    render() {
        return (
            <div>
                <Typography variant='title'>Wallet details</Typography>
                <div style={{ display: 'inline-block' }}>
                    <span>Token balance</span>{this.state.wallet && <MutBalance amount={this.state.wallet.available_balance} />}
                </div>
                <div style={{ display: 'inline-block' }}>
                    <span>Effective funds</span><MutBalance amount={this.state.effectiveFunds} />
                </div>
                <Typography variant='title'>Your tasks</Typography>
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