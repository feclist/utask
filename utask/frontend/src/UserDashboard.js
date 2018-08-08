import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Tabs } from '../node_modules/@material-ui/core';
import Tab from '@material-ui/core/Tab';
import TransactionList from './components/TransactionList';


const styles = theme => ({
    root: {
        marginTop: 12,
        width: 800,
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
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                >
                    <Tab label="Tasks" value={0} />
                    <Tab label="Transaction history" value={1} />
                </Tabs>
                {this.state.value === 0 && <div>hoaifj</div>}
                {this.state.value === 1 && <TransactionList />}
            </div>
        )
    }
}

export default withStyles(styles)(UserDashboard);
