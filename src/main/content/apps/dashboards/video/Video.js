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

class Video extends Component {

	state = {video:  null}
	constructor(props)
	{
		super(props);
		this.state = {
			video: this.props.user.activeVideo
		}
	}

	state = {
		selected: -1
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
		this.refs.player.play();
	}


	changeCurrentTime(seconds) {
		return () => {
		  const { player } = this.refs.player.getState();
		  const currentTime = player.currentTime;
		  this.refs.player.seek(seconds);
		};
	}



	render()
	{
		const {classes} = this.props;
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
							<ControlBar>
								<PlaybackRateMenuButton rates={[2, 1, 0.5]} />
								<ReplayControl seconds={10} order={2.2} />
								<ForwardControl seconds={10} order={3.2} />
							</ControlBar>
						</Player>
					</Grid>
					<Grid item xs={4}>
						<Paper>
							<div style={{ overflow: 'auto', height: 'calc(100vh - 130px)' }}>
								<Table className={classes.table} style={{tableLayout: 'fixed'}}>
									<TableHead>
										<TableRow>
											<TableCell>Start (sec)</TableCell>
											<TableCell>End (sec)</TableCell>
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
														{segment.start} s
													</TableCell>
													<TableCell component="th" scope="row" onClick = {()=>{this.setState({selected: index})}} >
														{segment.end} s
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
