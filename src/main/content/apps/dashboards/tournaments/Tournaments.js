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

class Tournaments extends Component {


	state = {
		clicked: false
	}

	constructor(props)
	{
		super(props);
	}

	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		if (this.props.user.activeVideo !== null && this.props.user.activeVideo !== undefined && this.state.clicked) {
			return <Redirect to='/apps/dashboards/video' />
		}
	}

	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}>
				{this.renderRedirect()}
				<Grid container spacing={24}>
					{this.props.user.team.Videos.map((video, index)=>
						(<Grid item xs={2}>
							<Card key = {index} style = {{width: "100%", height: 280}}>
								<CardActionArea>
									<CardMedia title="Thumb">
											{(video.processedImageUri==null || video.processedImageUri==undefined || video.processedImageUri == "")? <img src="assets/images/processing.png"/>:<img src={video.processedImageUri}/> }
									</CardMedia>
									<CardContent>
										<Typography gutterBottom variant="headline" component="h2">
											{video.metadata.tournament}
										</Typography>
									</CardContent>
								</CardActionArea>
								<CardActions>
									<Button size="small" color="primary" onClick={() => {
										this.setState({clicked: true})
										store.dispatch(this.props.setCurrentVideo(video))
									}}>										
										View
									</Button>
								</CardActions>
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
		setCurrentVideo: Actions.setCurrentVideo
	}, dispatch);
}

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Tournaments)));
