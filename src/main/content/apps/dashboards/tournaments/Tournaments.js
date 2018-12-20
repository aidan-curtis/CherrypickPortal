import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {Typography} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import store from 'store'
import * as Actions from 'auth/store/actions';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Tournaments extends Component {


	state = {
		clicked: false
	}

	constructor(props)
	{
		super(props);
		this.props.setTournamentFilterPage()
	}
	componentDidMount(){
		this.props.setTournamentFilterPage()
	}
	
	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		var link = '/apps/dashboards/matches/tournament/'+this.state.tname
		if (this.state.clicked) {
			return <Redirect to={link}/>
		}
	}
	get_folders(){
		return this.props.user.team.Videos.filter(function(item, i, ar){ return ar.map(function(vid){return vid.metadata.tournament}).indexOf(item.metadata.tournament) === i; })
	}
	get_num_videos_by_name(name){
		return this.props.user.team.Videos.filter(function(video){return video.metadata.tournament === name}).length
	}

	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}>
				{this.renderRedirect()}
				<Grid container spacing={24}>
					{this.get_folders().map((video, index)=>
						(<Grid key={index} item xs={4}>
							<Card key = {index} style = {{width: "100%"}}>
								<CardContent  onClick={() => {
									this.setState({clicked: true,
												   tname: video.metadata.tournament})
								}}>
									<Typography gutterBottom variant="headline" component="h2">
										{video.metadata.tournament}
									</Typography>
									<Typography gutterBottom variant="subheading" component="h3">
										{this.get_num_videos_by_name(video.metadata.tournament)} Videos
									</Typography>
								</CardContent>
							</Card>
						</Grid>))}
					</Grid>
			</div>
		)
	};
}

function mapDispatchToProps(dispatch)
{
	return bindActionCreators({
		setCurrentTournament: Actions.setCurrentTournament,
		setTournamentFilterPage: Actions.setTournamentFilterPage
	}, dispatch);
}

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Tournaments)));
