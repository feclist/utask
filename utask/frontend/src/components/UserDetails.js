import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider } from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { retrieveMe } from '../actions/account'
import MutBalance from './MutBalance';


const styles = theme => ({
    root: {
        marginTop: 12,
        margin: 'auto',
    },
    userDetailHeader: {
        display: 'block',
        margin: 12,
        fontWeight: 'bold',
    },
    userDetailText: {
        display: 'block',
        margin: 8,
        '& span:first-child': {
            marginRight: 36,
        }
    }
})

class UserDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            effectiveFunds: 0,
        }
    }

    async componentDidMount() {
        const effectiveFunds = await this.props.apiClient.me.wallet.effectiveFunds()
        if (effectiveFunds.effective_funds) this.setState({ effectiveFunds: effectiveFunds.effective_funds })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <span className={classes.userDetailHeader}>Wallet details</span>
                <Divider />
                <div className={classes.userDetailText}>
                    <span>Token balance</span>{this.props.wallet && <MutBalance amount={this.props.wallet.available_balance} />}
                </div>
                <div className={classes.userDetailText}>
                    <span>Effective funds</span><MutBalance amount={this.state.effectiveFunds} />
                </div>
                <div className={classes.userDetailText}>
                    <span><strong>{this.props.transactions.length}</strong> total transactions</span>
                </div>
                <span className={classes.userDetailHeader} style={{ marginTop: 18 }}>Your tasks</span>
                <Divider />
                <div className={classes.userDetailText}>
                    <span>You completed&nbsp;<strong>{this.props.completedTasks.length}</strong> task{this.props.completedTasks.length > 1 && 's'}</span>
                </div>
                <div className={classes.userDetailText}>
                    <span>You're working on&nbsp;<strong>{this.props.liveTasks.length}</strong> task{this.props.liveTasks.length > 1 && 's'}</span>
                </div>
                <div className={classes.userDetailText}>
                    <span>You created&nbsp;<strong>{this.props.myTasks.length}</strong> task{this.props.myTasks.length > 1 && 's'}</span>
                </div>
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
    )(withStyles(styles)(UserDetails))
)