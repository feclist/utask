import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Tabs, Grid } from '../node_modules/@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TransactionList from './components/TransactionList';
import TaskList from './components/TaskList';
import UserDetails from './components/UserDetails';
import { connect } from 'react-redux'
import TaskWrapper from './components/TaskWrapper'
import TaskDetail from './components/TaskDetail'


const styles = theme => ({
    root: {
        marginTop: 12,
        margin: 'auto',
    }
})

class UserDashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabValue: 0,
            transactions: [],
            liveTasks: [],
            completedTasks: [],
            myTasks: [],
            wallet: undefined,
        }
    }

    async componentDidMount() {
        const transactionResponse = await this.props.apiClient.me.wallet.transactions.list()
        this.setState({
            transactions: transactionResponse.transactions
        })

        // MERGE THIS WIT HTHE ABOVE
        const taskResponse = await this.props.apiClient.tasks.userTasks()
        this.setState({
            liveTasks: taskResponse.live_tasks.map(task => {
                task.activeForUser = true
                return task
            }),
            completedTasks: taskResponse.completed_tasks
        })

        // MERGE THIS WIT HTHE ABOVE
        const ownTaskResponse = await this.props.apiClient.me.tasks.list()
        this.setState({
            myTasks: ownTaskResponse
        })

        const wallet = await this.props.apiClient.me.wallet.retrieve()
        if (wallet.balance !== undefined) this.setState({ wallet: wallet.balance })
    }

    handleChange = (event, value) => {
        this.setState({ tabValue: value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={8}>
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab label="Tasks" value={0} />
                            <Tab label="Your Tasks" value={1} />
                            <Tab label="Transaction history" value={2} />
                        </Tabs>
                        <TaskList style={{ display: this.state.tabValue === 0 ? 'block' : 'none' }} liveTasks={this.state.liveTasks} completedTasks={this.state.completedTasks} />
                        <div style={{ display: this.state.tabValue === 1 ? 'block' : 'none' }}>
                            {this.state.myTasks && this.state.myTasks.map((task) =>
                                <TaskWrapper key={task.id}>
                                    <TaskDetail task={task} />
                                </TaskWrapper>
                            )}
                        </div>
                        <TransactionList style={{ display: this.state.tabValue === 2 ? 'block' : 'none' }} transactions={this.state.transactions} />
                    </Grid>
                    <Grid item xs={4}>
                        <UserDetails
                            liveTasks={this.state.liveTasks}
                            completedTasks={this.state.completedTasks}
                            transactions={this.state.transactions}
                            myTasks={this.state.myTasks}
                            wallet={this.state.wallet}
                        />
                    </Grid>
                </Grid>
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
)(withStyles(styles)(UserDashboard))
