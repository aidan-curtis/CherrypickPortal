import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import store from 'store'
import * as Actions from 'auth/store/actions';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Untagged extends Component {

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

	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		var link = '/apps/dashboards/tagvideo/untagged/'+this.state.vid+'/'+this.state.vname
		if (this.state.clicked) {
			return <Redirect to={link}/>
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
				{props.user.team.Videos.filter((video)=>{
					return video.state == "untagged"	
				}).map((video, index)=>
						(<Grid key={index} item xs={4} onClick={() => {
										if((video.processedImageUri === null || video.processedImageUri === undefined || video.processedImageUri === "")){

										} else {
											this.setState({clicked: true,
														   vid: video._id,
														   vname: video.metadata.matchName})
										}
									}}  style = {{width: "100%", position: "relative"}}>

									<span style={{	position: "absolute",
													top: "40%",
													left: 0,
													width: "100%",
													color: "white",
													textAlign: "center",
													fontSize: 24}}>{video.metadata.matchName}</span>
									{(video.processedImageUri === null || video.processedImageUri === undefined || video.processedImageUri === "")? <img alt="processing" style={{borderRadius: 5 ,overflow: 'hidden', width: "100%"}} src="assets/images/processing.png"/>:<img alt="thumbnail" style={{borderRadius: 5 ,overflow: 'hidden'}} src={video.processedImageUri}/> }
					
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Untagged)));
