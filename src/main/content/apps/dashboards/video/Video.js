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



const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Video extends Component {

	state = {video:  null}
	constructor(props)
	{
		super(props);
		this.state = {
			video: this.props.user.team.Videos.filter((video)=>{
				return video._id === this.props.match.params.videoid
			})[0],
			current_segment : 0
		}
	}

	state = {
		selected: -1,
		current_segment : 0
	}

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


	componentDidMount() {
		// subscribe state change
		this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
		this.refs.player.play();
	}


	changeCurrentTime(seconds) {
		return () => {
			this.refs.player.seek(seconds);
		};
	}



	render()
	{
		const {classes} = this.props;
		console.log(this.state.video.Segments)
		return (
			<div className={classes.root} style = {{padding: 50}}>
				<Grid container spacing={24}>
					<Grid item xs={8}>
						<Player
							playsInline
							ref="player"
							poster={this.state.video.processedImageUri}
							src={this.state.video.processedVideoUri}
						>
						    <LoadingSpinner />
							<ControlBar>
								<PlaybackRateMenuButton rates={[0.5, 1, 1.5]} />
								<ReplayControl seconds={10} order={2.2} />
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
	
						<Button type="submit" variant="outlined" color="primary" style={{width: "100%", marginTop: 10}} href={this.state.video.signedProcessedVideoUri} >Download</Button>


					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 130px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Points</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.video.Segments.map((segment, index)=>{
											var cell_color = "#fff"
											if(this.state.selected===index){
												cell_color = "#eee"
											}
											return (
												<TableRow key={index} style ={{backgroundColor: cell_color}} onClick = {this.changeCurrentTime(segment.start)}>
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
