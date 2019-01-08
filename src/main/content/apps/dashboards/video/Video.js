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
			spliced: false
		}

		var token = this.props.user.token
		if(token == "" || token == undefined){
			token = localStorage.token
		}

		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/get_signed_url_for_key",
			responseType: 'json',
			headers: {
				"authorization": token
			},
			data: {
				"merged_key": this.state.video.processedVideoKey,
				"spliced_key": this.state.video.splicedVideoKey
			}
		}).then((response) => {	
			this.setState({
				"signed_merged_url": response.data.signed_merged_url,
				"signed_spliced_url": response.data.signed_spliced_url,
			})		
		})


	}

	
	handleStateChange(state, prevState) {
		// copy player state to this component's state
		if(!state.paused && this.state.video.Segments.length>0){
			if(this.state.current_segment < this.state.video.Segments.length){

				if(state.currentTime < this.state.video.Segments[this.state.current_segment].start ){
					this.refs.player.seek(this.state.video.Segments[this.state.current_segment].start);
				}
				if(state.currentTime > this.state.video.Segments[this.state.current_segment].stop ){
					if(this.state.current_segment+1 < this.state.video.Segments.length){
						this.refs.player.seek(this.state.video.Segments[this.state.current_segment].start);
					}
					this.setState({
						current_segment: this.state.current_segment+1
					})
				}
				this.setState({
					player: state
				});
				this.refs.player.play()
			} else {
				this.refs.player.pause()
			}
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
		this.setState({
			current_segment: index,
			currentTime: seconds
		})
		this.refs.player.seek(seconds);
		return () => {
			
		};
	}

	handleSwitchChange = name => event => {
		if(this.state.video.splicedVideoUri != undefined && this.state.video.splicedVideoUri != null){
			this.setState({ [name]: event.target.checked });
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
				editOpen: false
			})		
		})
	}


	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}>
				<div style={{height: 50}}>
				<FormControlLabel
					control={
						<Switch
							checked={this.state.spliced}
							onChange={this.handleSwitchChange('spliced')}
							value="spliced"
						/>
					}
					label={this.state.spliced?"Spliced":"Segmented"}
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
								<TextField
									id=""
									label="Player 2 Name"
									value={this.state.video.metadata.playerName2}
									onChange={this.handleChange('playerName2')}
									margin="normal"
								/>
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
					<Grid item xs={this.state.spliced?12:8}>
						<Player
							playsInline
							ref="player"
							poster={this.state.video.processedImageUri}
							src={this.state.spliced? this.state.video.splicedVideoUri: this.state.video.processedVideoUri}
						>
							<LoadingSpinner />
							<ControlBar>
								<PlaybackRateMenuButton rates={[0.5, 1, 1.5]} />
								<ReplayControl seconds={10} order={2.2} onClick={()=>{console.log("replay")}} />
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} href={this.state.spliced?this.state.signed_spliced_url:this.state.signed_merged_url}>{this.state.spliced?"Download Spliced":"Download Full"}</Button>
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} onClick={()=>{this.setState({editOpen: true})}} >Edit Match Info</Button>

					</Grid>
					<Grid item xs={this.state.spliced?0:4} hidden={this.state.spliced}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 170px)' }}>
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
