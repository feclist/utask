import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CompletedTask from './CompletedTask';


const styles = {
}

class TaskDrawer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Drawer anchor="right" open={this.props.open} onClose={this.props.onClose}>
                    {(this.props.task && this.props.transaction) && <CompletedTask task={this.props.task} transaction={this.props.transaction} />}
                </Drawer>
            </div>
        );
    }
}

TaskDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskDrawer);