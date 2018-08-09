import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '../../node_modules/@material-ui/core';

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
            value: 0
        }
    }

    render() {
        return (
            <div>
                <Typography variant='title'>Wallet details</Typography>
            </div>
        )
    }
}

export default withStyles(styles)(Wallet)