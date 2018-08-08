import React, { Component } from 'react'
import { withStyles } from "../../node_modules/@material-ui/core";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import MutBalance from './MutBalance'
import moment from 'moment'


const styles = theme => ({
    root: {
    },
    actionName: {
        display: 'inline-block'
    },
    listItemContent: {
        marginLeft: '40px',
        width: '100%',
    },
    listItem: {
    },
    commissionField: {
        display: 'inline-block',
        marginLeft: theme.spacing.unit,
        '& > span:first-child': {
            marginRight: theme.spacing.unit,
        }
    },
    taskDrawerTrigger: {
        color: '#27b6da',
        cursor: 'pointer',
        borderBottom: '1px solid',
    }
})

class Transaction extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes, ...other } = this.props
        return (
            <ListItem className={classes.listItem}>
                <Avatar style={{ backgroundColor: (this.props.ostId && this.props.ostId === this.props.transaction.from_user_id ? "#FF5252" : "#B2FF59") }}>
                    {this.props.ostId && this.props.ostId === this.props.transaction.from_user_id ? <RemoveIcon /> : <AddIcon />}
                </Avatar>
                <div className={classes.listItemContent}>
                    <Typography variant="subheading" gutterBottom className={classes.actionName}>
                        {this.props.transaction.action.name}
                    </Typography>

                    <Typography variant="body1" gutterBottom align="right" style={{ float: 'right' }}>
                        {moment
                            .utc(this.props.transaction.timestamp)
                            .local()
                            .format('DD/MM/YYYY')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <MutBalance amount={this.props.transaction.amount} />
                        {
                            this.props.transaction.commission_amount !== "0" &&
                            <div className={classes.commissionField}>
                                <span>+</span> 
                                <MutBalance amount={this.props.transaction.commission_amount} />
                            </div>
                        }
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {this.props.transaction.task_id && <p>Belongs to <span className={classes.taskDrawerTrigger} onClick={this.props.triggerTaskDrawer}>this task</span></p>}
                    </Typography>
                </div>
            </ListItem>
        )
    }
}

export default withStyles(styles)(Transaction)