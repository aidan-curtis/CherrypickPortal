import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import store from 'store'
import * as Actions from 'auth/store/actions';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

class AccountInformation extends Component {

	state = {
		clicked: false
	}

	constructor(props)
	{
		super(props);
		if(props.user.activePlayer != null){
			this.props.setCurrentPlayer(props.user.activePlayer)
		}
		if(props.user.activeTournament != null){
			this.props.setCurrentTournament(props.user.activeTournament)
		}
		this.state['type'] = props.match.params.type
		this.state['name'] = props.match.params.name
	}

	

	render()
	{
		const {classes} = this.props;
		var props = this.props;
		var num_tagged = this.props.user.team.Videos.length
		return (
			<div className={classes.root} style = {{padding: 50}}>
				<Card style={{width: "100%", height: "100px"}}>
					<CardContent>
						<Typography className={classes.title} color="textPrimary" gutterBottom>

							Usage Stats

						</Typography>

						<Typography className={classes.title} color="textSecondary" gutterBottom>

							Matches Tagged: {num_tagged}

						</Typography>
						<Typography className={classes.title} color="textSecondary" gutterBottom>

							Matches Remaining: {this.props.user.team.tagCap - num_tagged}

						</Typography>
						
					</CardContent>
				</Card>
				
			</div>
		)
	};
}

function mapDispatchToProps(dispatch)
{
	return bindActionCreators({
		setCurrentVideo: Actions.setCurrentVideo,
		setCurrentPlayer: Actions.setCurrentPlayer,
		setCurrentTournament: Actions.setCurrentTournament

	}, dispatch);
}

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountInformation)));
