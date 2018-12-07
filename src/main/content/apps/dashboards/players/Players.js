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

class Players extends Component {


	state = {
		clicked: false
	}

	constructor(props)
	{
		super(props);
		this.props.setPlayerFilterPage()
	}
	componentDidMount(){
		this.props.setPlayerFilterPage()
	}
	
	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		if (this.props.user.activePlayer !== null && this.props.user.activePlayer !== undefined && this.state.clicked) {
			return <Redirect to='/apps/dashboards/matches' />
		}
	}

	get_folders(){
		var pnames = this.props.user.team.Videos.map(function(vid){return vid.metadata.playerName1}).concat(this.props.user.team.Videos.map(function(vid){return vid.metadata.playerName2}).filter(function(name){return name!=undefined && name!=""}))
		return pnames.filter(function(item, i, ar){ return pnames.indexOf(item) === i; })
	}
	get_num_videos_by_name(name){
		return this.props.user.team.Videos.filter(function(video){return (video.metadata.playerName1 == name || video.metadata.playerName2 == name)}).length
	}

	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}>
				{this.renderRedirect()}
				<Grid container spacing={24}>
					{this.get_folders().map((pname, index)=>
						(<Grid item xs={4}>
							<Card key = {index} style = {{width: "100%"}}>
								<CardContent  onClick={() => {
									this.setState({clicked: true})
									store.dispatch(this.props.setCurrentPlayer(pname))
								}}>
									<Typography gutterBottom variant="headline" component="h2">
										{pname}
									</Typography>
									<Typography gutterBottom variant="subheading" component="h3">
										{this.get_num_videos_by_name(pname)} Videos
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
		setCurrentPlayer: Actions.setCurrentPlayer,
		setPlayerFilterPage: Actions.setPlayerFilterPage
	}, dispatch);
}

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Players)));
