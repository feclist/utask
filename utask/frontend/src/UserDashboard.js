import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Tabs, Grid } from '../node_modules/@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TransactionList from './components/TransactionList';
import TaskList from './components/TaskList';
import Wallet from './components/Wallet';


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
            value: 0
        }
    }

    handleChange = (event, value) => {
        this.setState({ value: value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={8}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab label="Tasks" value={0} />
                            <Tab label="Your Tasks" value={1} />
                            <Tab label="Transaction history" value={2} />
                        </Tabs>
                        <TaskList style={{ display: this.state.value === 0 ? 'block' : 'none' }} />
                        <TransactionList style={{ display: this.state.value === 2 ? 'block' : 'none' }} />
                    </Grid>
                    <Grid item xs={4}>
                        <Wallet />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(UserDashboard);
