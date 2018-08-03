import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'inline-block'
  },
  amount: {
    color: '#777',
    fontSize: 18,
    marginLeft: theme.spacing.unit,
    display: 'inline-block'
  },
  image: {
    display: 'inline-block',
    verticalAlign: 'top'
  }
})

const MutBalance = ({ amount, classes }) => {
  return (
    <div className={classes.root}>
      <img
        className={classes.image}
        src={require('../images/MUT_ico.svg')}
        width="24"
        height="24"
      />
      <Typography className={classes.amount} variant="title">
        {amount}
      </Typography>
    </div>
  )
}

MutBalance.propTypes = {}

export default withStyles(styles)(MutBalance)
