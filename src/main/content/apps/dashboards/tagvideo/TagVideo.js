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



const styles = theme => ({
	root: {
		width: '100%'
	}
});

class TagVideo extends Component {

	handleKeyPress = (event) => {
		if(event.key === 's') {
			var temp_segments = this.state.segments
			if(this.state.segment_index%2==0){
				temp_segments[this.state.segment_index/2]['start'] = parseInt(this.state.player.currentTime)
			} else {
				temp_segments[parseInt(this.state.segment_index/2)]['stop'] = parseInt(this.state.player.currentTime)
			}
			if((this.state.segment_index+1)/2 === this.state.segments.length ){
				temp_segments.push({})
			}
			this.setState({segments: temp_segments, segment_index: this.state.segment_index+1})
			this.state.tagEnd.scrollIntoView({ behavior: "smooth" });

		}
		else if(event.key === 'a') {
			if(this.state.segment_index > 0){
				this.setState({
					segment_index: this.state.segment_index-1
				})
			}
		}
		else if(event.key === 'd') {
			if((this.state.segment_index+1)/2 < this.state.segments.length){
				this.setState({
					segment_index: this.state.segment_index+1
				})
				this.state.tagEnd.scrollIntoView({ behavior: "smooth" });
			}
		}
		if((event.key === 'd' || event.key === 'a') && this.refs.player != undefined){
			//Seek tag in video player
			if(Math.floor(this.state.segment_index/2) != this.state.segment_index/2){
				this.refs.player.seek(this.state.segments[Math.floor(this.state.segment_index/2)]["stop"]);
			}
			else {
				this.refs.player.seek(this.state.segments[Math.floor(this.state.segment_index/2)]["start"]);
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
			segments: [{}],
			submit_timestamps: "Submit Timestamps"
		}
	}

	handleStateChange(state, prevState) {
		// copy player state to this component's state
		this.setState({
			player: state
		});
	}




	componentDidMount() {
		// subscribe state change
		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
		document.addEventListener("keydown", this.handleKeyPress.bind(this));

	}

	changeCurrentTime(seconds) {
		
		this.refs.player.seek(seconds);
		
	}

	submitTimestamps(){
		var cloneSegments = this.state.segments.slice();
		cloneSegments.splice(-1,1)
		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/process_video",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			},
			data: {
				"videoId": this.state.video._id,
				"timestamps": JSON.stringify(cloneSegments)
			}
		}).then((response) => {
			
			this.setState({
				submit_timestamps:"Submitted"
			})
			console.log(response)
		})
	}
	lpad(number, digits) {
		return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
	}

	get_time(time_string){
		if(time_string == undefined){
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
				<Grid container spacing={24}>
					<Grid item xs={8}>
						<Player
							playsInline
							ref="player"
							poster={this.state.video.processedImageUri}
							src={this.state.video.processedVideoUri}
						>
							<ControlBar>
								<PlaybackRateMenuButton rates={[1, 2, 3]} />
								<ReplayControl seconds={10} order={2.2} />
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 170px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Start</TableCell>
											<TableCell>Stop</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.segments.map((segment, index)=>{
											var cell_color_start = "#fff"
											var cell_color_stop = "#fff"
											if(this.state.segment_index===index*2){
												cell_color_start = "#eee"
											}
											if(this.state.segment_index===index*2+1){
												cell_color_stop = "#eee"
											}
											return (
												<TableRow key={index} >
													<TableCell style ={{backgroundColor: cell_color_start}} component="th" scope="row" onClick = {()=>{
														this.setState({segment_index: index*2})
														this.changeCurrentTime(segment.start)
													}}>
														{ this.get_time(segment.start)}
													</TableCell>
													<TableCell style ={{backgroundColor: cell_color_stop}} component="th" scope="row" onClick = {()=>{
														this.setState({segment_index: index*2+1})
														this.changeCurrentTime(segment.stop)
													}} >
														{this.get_time(segment.stop)}
													</TableCell>
												</TableRow>
											)
										})}
										<div ref={(el) => { 
											if(this.state.tagEnd == undefined){
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagVideo)));
