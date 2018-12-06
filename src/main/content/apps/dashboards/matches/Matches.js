import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {Typography} from '@material-ui/core';
import {Chart} from 'react-chartjs-2';
import {FuseAnimate} from '@fuse';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import store from 'store'
import * as Actions from 'auth/store/actions';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Matches extends Component {

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
	}

	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		if (this.props.user.activeVideo !== null && this.props.user.activeVideo !== undefined && this.state.clicked) {
			return <Redirect to='/apps/dashboards/video'/>
		}
	}

	render()
	{
		const {classes} = this.props;
		var props = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}>
				{this.renderRedirect()}
				<Grid container spacing={24}>
				{props.user.team.Videos.filter(function(video){
					if(props.user.activePlayer != null){
						return video.metadata.playerName == props.user.activePlayer
					}
					else if(props.user.activeTournament !=null){
						return video.metadata.tournament == props.user.activeTournament
					}
					else{
						return false
					}
				}).map((video, index)=>
						(<Grid item xs={4} onClick={() => {
										if((video.processedImageUri==null || video.processedImageUri==undefined || video.processedImageUri == "")){

										} else {
											this.setState({clicked: true})
											store.dispatch(this.props.setCurrentVideo(video))
										}
									}}  style = {{width: "100%", position: "relative"}}>

									<span style={{	position: "absolute",
													top: "35%",
													left: 0,
													width: "100%",
													color: "white",
													textAlign: "center",
													fontSize: 34}}>{video.metadata.matchName}</span>


									<CardMedia title="Thumb" >
											{(video.processedImageUri==null || video.processedImageUri==undefined || video.processedImageUri == "")? <img style={{borderRadius: 5 ,overflow: 'hidden', width: "100%"}} src="assets/images/processing.png"/>:<img style={{borderRadius: 5 ,overflow: 'hidden'}} src={video.processedImageUri}/> }
									</CardMedia>
						</Grid>)
					)}
				</Grid>
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Matches)));
