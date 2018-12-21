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
			segment_index: 0,
			segments: [{}]
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
		return () => {
			this.refs.player.seek(seconds);
		};
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
	
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} href={this.state.video.signedProcessedVideoUri} >Submit Timestamps</Button>


					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 130px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Start (sec)</TableCell>
											<TableCell>Stop (sec)</TableCell>
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
												<TableRow key={index}  onClick = {this.changeCurrentTime(segment.start)}>
													<TableCell style ={{backgroundColor: cell_color_start}} component="th" scope="row" onClick = {()=>{this.setState({segment_index: index*2})}}>
														{segment.start}
													</TableCell>
													<TableCell style ={{backgroundColor: cell_color_stop}} component="th" scope="row" onClick = {()=>{this.setState({segment_index: index*2+1})}} >
														{segment.stop}
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagVideo)));
