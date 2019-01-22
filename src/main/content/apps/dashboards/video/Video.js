import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import Button from '@material-ui/core/Button';
import {
  Player, ControlBar, PlaybackRateMenuButton,ReplayControl,ForwardControl, LoadingSpinner
} from 'video-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Popover} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import axios from 'axios/index';
import AppBar from '@material-ui/core/AppBar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Autosuggest from 'react-autosuggest';
import { Redirect } from 'react-router-dom'

import store from 'store';
export const SET_USER_DATA = '[USER] SET DATA';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Video extends Component {


	handleKeyPress = (event) => {
		if(event.key === ' ') {
			if(this.state.player.paused){
				this.refs.player.play()
			} else {
				this.refs.player.pause()
			}
		}
	}


	state = {video:  null}
	constructor(props)
	{
		super(props);
		this.state = {
			video: this.props.user.team.Videos.filter((video)=>{
				return video._id === this.props.match.params.videoid
			})[0],
			current_segment : 0,
			link: window.location.href.split("/")
		}


		if(this.state.video.splicedVideoUri==undefined){
			this.state.spliced=false
		} else {
			this.state.spliced=true
		}

		this.state.d_index =  this.state.link.indexOf("dashboards")


		var token = this.props.user.token
		if(token == "" || token == undefined){
			token = localStorage.token
		}

		

		//Build up the segments for spliced points
		var spliced_points = [0]
		if(this.state.video.Segments != undefined){
			for (var i = 0 ; i< this.state.video.Segments.length; i+=1){
				spliced_points.push(parseFloat(spliced_points[i])+parseFloat(this.state.video.Segments[i].stop)-parseFloat(this.state.video.Segments[i].start))
			}
		}

		this.state["spliced_points"] = spliced_points

		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/get_signed_url_for_key",
			responseType: 'json',
			headers: {
				"authorization": token
			},
			data: {
				"merged_key": this.state.video.processedVideoKey,
				"spliced_key": this.state.video.splicedVideoKey,
				"matchName": this.state.video.metadata.matchName
			}
		}).then((response) => {	
			this.setState({
				"signed_merged_url": response.data.signed_merged_url,
				"signed_spliced_url": response.data.signed_spliced_url,
			})		
		})
	}


	handleSegmentsStateChange(state, prevState){
		for (var i=0; i<this.state.spliced_points.length; i+=1){
			// For seeking after splice switch
			if(this.state.spliced_seek != undefined){
				this.setState({
					spliced_seek: undefined
				})
				this.refs.player.seek(this.state.spliced_seek)
			}
			if(state.currentTime<this.state.spliced_points[i]){
				if(this.state.current_segment != i-1){
					this.setState({
						current_segment: i-1
					})
					this.state.tagEnd.scrollIntoView({ behavior: "smooth" });
				}
				break;
			}
		}
	}

	handleFullMatch(state, prevState){
		if(this.state.video.Segments.length>0){
			//For seeking after splice switch
			if(this.state.full_seek != undefined){
				this.setState({
					full_seek: undefined
				})
				this.refs.player.seek(this.state.full_seek)
			}
			for (var i=0; i<this.state.spliced_points.length; i+=1){
				if(state.currentTime<this.state.video.Segments[i]['start']){
					if(this.state.current_segment != i-1){
						this.setState({
							current_segment: i-1
						})
						this.state.tagEnd.scrollIntoView({ behavior: "smooth" });
					}
					break;
				}
			}
		}
	}

	handleStateChange(state, prevState) {
		if (this.state.spliced) {
			this.handleSegmentsStateChange(state, prevState)
		} else {
			this.handleFullMatch(state, prevState)
		}
	}

	editClose = () => {
		this.setState({editOpen: null});
	};

	componentDidMount() {
		// subscribe state change
		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
		this.refs.player.play();
	}


	changeCurrentTime(seconds, index) {
		console.log("Change current time")
		this.setState({
			current_segment: index
		})
		if(this.state.spliced){
			this.refs.player.seek(this.state.spliced_points[index]);
		} else{
			this.refs.player.seek(seconds);
		}
		return () => {};
	}

	handleSwitchChange = name => event => {
		// If the video has finished splicing, we can move to the spliced version of the video
		if(this.state.video.splicedVideoUri != undefined){
			if(this.state.spliced){
				// From spliced to full
				this.setState({
					full_seek: this.state.video.Segments[Math.max(this.state.current_segment,0)]['start']
				})
			} else {
				// From full to spliced
				this.setState({
					spliced_seek: this.state.spliced_points[this.state.current_segment]
				})
			}

			this.setState({ [name]: event.target.checked });
			
		} else {
			// Otherwise show warning that this video has not been spliced yet.
			this.setState({
				view_splice_warning: true
			})
		}
	};


	handleChange = name => event => {
		this.setState({
			video: {
				...this.state.video,
				metadata:{
					...this.state.video.metadata,
					[name]: event.target.value
				}
			}
		});
	};


	handleSubmitContinue = () => {
		var token = this.props.user.token
		if(token == "" || token == undefined){
			token = localStorage.token
		}
		
		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/update_video_metadata",
			responseType: 'json',
			headers: {
				"authorization": token
			},
			data: {
				"videoId": this.state.video._id,
				"tournament": this.state.video.metadata.tournament,
				"playerName1": this.state.video.metadata.playerName1,
				"playerName2": this.state.video.metadata.playerName2,
				"matchName": this.state.video.metadata.matchName
			}
		}).then((response) => {	

			this.setState({
				editOpen: false,
				new_link: '/apps/dashboards/video/'+this.state.link[this.state.d_index+2] +'/'+this.state.video.metadata.playerName1+'/'+this.state.video.metadata.matchName+"/"+this.state.video._id
			})		
		})
	}


	handleDialogClose = () => {
		this.setState({
			view_splice_warning: false
		})
	}

	renderRedirect = () => {
		if (this.state.new_link) {
			return <Redirect to={this.state.new_link}/>
		}
	}

	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50, marginTop:-40}}>


				{this.renderRedirect()}

				<Dialog
					open={this.state.view_splice_warning}
					onClose={this.handleDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">We are currently working on splicing this video. Please come back in a little while</DialogTitle>
					<Button variant="contained" onClick={this.handleDialogClose} className={classes.button} style={{marginTop: 20}}>
						Close
					</Button>
				</Dialog>
				<div style={{height: 50}}>
				Full&nbsp;&nbsp;
				<FormControlLabel
					control={
						<Switch
							checked={this.state.spliced}
							onChange={this.handleSwitchChange('spliced')}
							value="spliced"
						/>
					}
					label="Segmented"
        		/>
				</div>

				<Dialog
					open={this.state.editOpen}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Testing instructions</DialogTitle>
					<DialogContent>

						<FormControl component="fieldset">
							<FormGroup>
								<TextField
									id=""
									label="Match Name"
									value={this.state.video.metadata.matchName}
									onChange={this.handleChange('matchName')}
									margin="normal"
								/>
								<TextField
									id=""
									label="Player 1 Name"
									value={this.state.video.metadata.playerName1}
									onChange={this.handleChange('playerName1')}
									margin="normal"
								/>
								{this.state.video.metadata.playerName2 == ""?null:
								<TextField
									id=""
									label="Player 2 Name"
									value={this.state.video.metadata.playerName2}
									onChange={this.handleChange('playerName2')}
									margin="normal"
								/>}
								<TextField
									id=""
									label="Dual Match Name"
									value={this.state.video.metadata.tournament}
									onChange={this.handleChange('tournament')}
									margin="normal"
								/>

								<Button variant="contained" onClick={this.handleSubmitContinue} className={classes.button} style={{marginTop: 20, width: "420px"}}>
									Submit
								</Button>
							</FormGroup>
						</FormControl>

					</DialogContent>
					<DialogActions>
						<Button onClick={this.editClose} color="primary" autoFocus>
							Close
						</Button>
					</DialogActions>
				</Dialog>

				<Grid container spacing={24}>
					<Grid item xs={8}>
						<Player
							playsInline
							ref="player"
							poster={this.state.video.processedImageUri}
							// src={this.state.spliced? this.state.video.splicedVideoUri: this.state.video.processedVideoUri}
							src={(!this.state.spliced)?this.state.video.processedVideoUri:this.state.video.splicedVideoUri}
						>
							<LoadingSpinner />
							<ControlBar>
								<PlaybackRateMenuButton rates={[0.5, 1, 1.5]} />
								<ReplayControl seconds={10} order={2.2}/>
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} href={(!this.state.spliced)?this.state.signed_merged_url:this.state.signed_spliced_url}>{this.state.spliced?"Download Segmented":"Download Full"}</Button>
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} onClick={()=>{this.setState({editOpen: true})}} >Edit Match Info</Button>

					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 220px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Points</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.video.Segments.map((segment, index)=>{
											var cell_color = "#fff"
											if(Math.floor(this.state.current_segment)===index){
												cell_color = "#eee"
											}
											return (
												<TableRow key={index} style ={{backgroundColor: cell_color}} onClick = {()=>{this.changeCurrentTime(segment.start, index)}}>
													<TableCell component="th" scope="row" onClick = {()=>{this.setState({selected: index})}}>
														Point {index+1}
													{index==this.state.current_segment?<div style = {{width: 0}} ref={(el) => { 
														if(this.state.tagEnd == undefined || this.state.tagEndIdx !== index){
															this.setState({
																tagEnd: el,
																tagEndIdx: index
															})
														}
													}}></div>:null}
													</TableCell>
												</TableRow>
												
											)
										})}

									</TableBody>
								</Table>
							</div>
						</Paper>
					</Grid>
				</Grid>
			</div>
		)
	};
}

function mapDispatchToProps(dispatch)
{
	return bindActionCreators({
	}, dispatch);
}

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Video)));
