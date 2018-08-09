import React from 'react'
import { TextField, Typography, Grid, Divider } from '../../node_modules/@material-ui/core'
import MutBalance from './MutBalance'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear'
import { Snackbar } from '../../node_modules/@material-ui/core'
import moment from 'moment'


const styles = theme => ({
    pageContainer: {
        display: 'block',
        margin: 'auto',
        width: 800,
        '& h2': {

        }
    },
    container: {
    },
    textField: {
        width: '100%',
    },
    button: {
        marginTop: 16,
        float: 'right',
    },
    errorText: {
        color: theme.palette.error.main,
        fontSize: 12,
    },
    floatRight: {
        float: 'right',
        marginTop: 4
    }
})

class CreateTask extends React.Component {
    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    state = {
        form: {
            title: '',
            description: '',
            amount: 1,
            reward: 1,
            endTime: ''
        },
        error: {
            title: '',
        },
        totalCost: 1,
        validCreation: false,
        snackOpen: false,
    }

    async componentDidMount() {
        const response = await window.apiClient.me.wallet.effectiveFunds()
        this.setState({
            effectiveFunds: response["effective_funds"]
        })
    }

    async handleSubmit() {
        console.log(JSON.stringify(this.state.form))
        const response = await window.apiClient.tasks.create(this.state.form)
        console.log(response)
        if (!response.id) this.setState({ error: response })
        else {
            this.setState({
                snackOpen: true,
            })
        }
    }

    handleChange = name => event => {
        this.setState({
            form: {
                ...this.state.form,
                [name]: event.target.value,
            }
        })
        if (name === 'amount' || name === 'reward') {
            const totalCost = event.target.value * (name === 'amount' ? this.state.form.reward : this.state.form.amount)
            if (totalCost > this.state.effectiveFunds) this.setState({ validCreation: true })
            else this.setState({ validCreation: false })
            this.setState({
                totalCost: totalCost,
            })
        }
    }

    handleSnackClose() {
        this.setState({
            snackOpen: false,
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.pageContainer}>
                <Typography
                    variant="title"
                >
                    Create a task
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={10}>
                        <form className={classes.container} noValidate autoComplete="off">
                            <Grid container spacing={24}>
                                <Grid item xs={8}>
                                    <TextField
                                        id="title"
                                        label="Title"
                                        className={classes.textField}
                                        value={this.state.form.title}
                                        onChange={this.handleChange('title')}
                                        margin="normal"
                                        required={true}
                                        helperText={this.state.error.title}
                                        FormHelperTextProps={{
                                            error: true,
                                        }}
                                    />
                                    <TextField
                                        id="description"
                                        label="Description"
                                        multiline
                                        rowsMax="4"
                                        rows="4"
                                        value={this.state.form.description}
                                        onChange={this.handleChange('description')}
                                        className={classes.textField}
                                        margin="normal"
                                        required={true}
                                        helperText={this.state.error.description}
                                        FormHelperTextProps={{
                                            error: true,
                                        }}
                                    />
                                    <TextField
                                        id="end-time"
                                        label="End time"
                                        type="datetime-local"
                                        value={this.state.form.endTime}
                                        onChange={this.handleChange('endTime')}
                                        defaultValue={moment(new Date()).format("YYYY-MM-DDTHH:MM")}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required={true}
                                        helperText={this.state.error.end_time}
                                        FormHelperTextProps={{
                                            error: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="reward"
                                        label="Reward"
                                        value={this.state.form.reward}
                                        onChange={this.handleChange('reward')}
                                        type="number"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        required={true}
                                        helperText={this.state.error.reward}
                                        FormHelperTextProps={{
                                            error: true,
                                        }}
                                    />
                                    <TextField
                                        id="amount"
                                        label="Amount"
                                        value={this.state.form.amount}
                                        onChange={this.handleChange('amount')}
                                        type="number"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        required={true}
                                        helperText={this.state.error.amount}
                                        FormHelperTextProps={{
                                            error: true,
                                        }}
                                    />
                                    <div style={{ textAlign: 'right', marginBottom: 5 }}>
                                        <ClearIcon color="disabled" />
                                    </div>
                                    <Divider />
                                    <div style={{ textAlign: 'right', marginTop: 10 }}>
                                        <MutBalance amount={this.state.totalCost} />
                                        {this.state.validCreation &&
                                            <p className={classes.errorText}>
                                                You cannot spend more than your effective funds
                                </p>}

                                    </div>
                                </Grid>
                            </Grid>
                            <Button disabled={this.state.validCreation} variant="outlined" color="primary" className={classes.button} onClick={this.handleSubmit}>
                                Create task
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={2}>
                        <span style={{ fontWeight: 'bold', fontSize: 12 }}>
                            Effective funds
                    </span>
                        <div className={classes.floatRight}>
                            <MutBalance amount={this.state.effectiveFunds} />
                        </div>
                    </Grid>
                </Grid>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={this.handleSnackClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Task is succesfully created!</span>}
                />
            </div>
        );
    }
}


export default withStyles(styles)(CreateTask);
