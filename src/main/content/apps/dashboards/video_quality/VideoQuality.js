import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import Button from '@material-ui/core/Button';
import {
  Player, ControlBar, PlaybackRateMenuButton,ReplayControl,ForwardControl
} from 'video-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import axios from 'axios/index';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import env from '../../../../../config'



const styles = theme => ({
	root: {
		width: '100%'
	}
});

class VideoQuality extends Component {



	handleStateChange(state, prevState) {
		// copy player state to this component's state
		
		if(!state.paused){
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
				console.log("pause")
				this.refs.player.pause()
			}
		}
	}



	constructor(props)
	{
		super(props);
		this.state = {
			video: this.props.user.team.Videos.filter((video)=>{
				return video._id === this.props.match.params.videoid
			})[0],
			current_segment : 0,
			segment_index: 0,
			submit_timestamps: "Submit Quality Check",
		}
	}


	componentDidMount() {
		// subscribe state change
		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
	}

	changeCurrentTime(seconds) {
		this.refs.player.seek(seconds);
	}


	handleDialogClose = () => {
		this.setState({
			error_open: false
		})
	}


	

	qualityCheck(){
		var cloneSegments = this.state.video.Segments.slice();
		cloneSegments.splice(-1,1)
		axios({
			method: "POST",
			url: env.REACT_APP_API_ENDPOINT + "/private_api/quality_check",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			},
			data: {
				"videoId": this.state.video._id,
				"timestamps": JSON.stringify(cloneSegments)
			}
		}).then((response) => {
			if(response.data.success === true){
				this.setState({
					submit_timestamps:"Submitted"
				})
				console.log(response)
			} else {
				this.setState({
					error_open: true,
					error_message:  response.data.message
				})
			}
		})
	}
	lpad(number, digits) {
		return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
	}

	get_time(time_string){
		if(time_string === undefined){
			return ""
		} else{
			return this.lpad(Math.floor(time_string/60.0), 2)+":"+this.lpad(time_string%60, 2)
		}
	}

	render()
	{
		const {classes} = this.props;
		return (
			<div className={classes.root} style = {{padding: 50}}  >
				<Dialog
					open={this.state.error_open}
					onClose={this.handleDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{this.state.error_message}</DialogTitle>
					<Button variant="contained" onClick={this.handleDialogClose} className={classes.button} style={{marginTop: 20}}>
						Close
					</Button>
				</Dialog>
				<Grid container spacing={24}>
					<Grid item xs={8}>
						<Player
							playsInline
							ref="player"
							poster={this.state.video.processedImageUri}
							src={this.state.video.processedVideoUri}
						>
							<ControlBar>
								<PlaybackRateMenuButton rates={[1, 2, 3, 4]} />
								<ReplayControl seconds={10} order={2.2} />
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
						<Button type="submit" disabled={this.state.submit_timestamps === "Submitted"} variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} onClick = {()=>{this.qualityCheck()}} >{this.state.submit_timestamps}</Button>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 170px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Start</TableCell>
											<TableCell>Stop</TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.video.Segments.map((segment, index)=>{
											var cell_color = "#fff"
								
											if(this.state.current_segment === index){
												cell_color = "#eee"
											}
											if(segment['reject'] !== undefined && segment['reject']){
												cell_color = "#FFB9B9"	
											}
											
											return (
												<TableRow key={index} style = {{backgroundColor: cell_color}}>
													<TableCell component="th" scope="row" onClick = {()=>{
														this.setState({current_segment: index})
														this.changeCurrentTime(segment.start)
													}}>
														{ this.get_time(segment.start)}
													</TableCell>
													<TableCell component="th" scope="row" onClick = {()=>{
														this.setState({current_segment: index})
														this.changeCurrentTime(segment.start)
													}}>
														{this.get_time(segment.stop)}
													</TableCell>
													<TableCell>
														<Button  onClick = {()=>{

														var segs = this.state.video.Segments
														if(segs[index]['reject']){
															segs[index]['reject'] = false
														} else {
															segs[index]['reject'] = true
														}
														
														this.setState(prevState => ({
															...prevState,
															video:{
																...prevState.video,
																Segments: segs
															}
														}))
														
														
													}}>{this.state.video.Segments[index]['reject']?"Undo":"Reject"}</Button>
													</TableCell>
												</TableRow>
											)
										})}
										<div ref={(el) => { 
											if(this.state.tagEnd === undefined){
												this.setState({
													tagEnd: el
												})
											}
										}}></div>
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoQuality)));
