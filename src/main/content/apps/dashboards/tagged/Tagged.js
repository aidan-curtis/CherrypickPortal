import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import store from 'store'
import Paper from '@material-ui/core/Paper';

import * as Actions from 'auth/store/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios/index';
export const SET_USER_DATA = '[USER] SET DATA';

const styles = theme => ({
	root: {
		width: '100%'
	}
});

class Tagged extends Component {

	state = {
		clicked: false,
		orderBy: "",
		order: "asc"

	}


	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		this.setState({ order, orderBy });
	};

	createSortHandler = property => event => {
		this.handleRequestSort(event, property);
	};

	constructor(props)
	{
		super(props);
		if(props.user.activePlayer != null){
			this.props.setCurrentPlayer(props.user.activePlayer)
		}
		if(props.user.activeTournament != null){
			this.props.setCurrentTournament(props.user.activeTournament)
		}
		this.state['type'] = decodeURIComponent(props.match.params.type)
		this.state['name'] = decodeURIComponent(props.match.params.name)
		var token = this.props.user.token
		if(token == "" || token == undefined){
			token = localStorage.token
		}
		axios({
			method: "GET",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/get_team",
			responseType: 'json',
			headers: {
				"authorization": token
			}
		}).then((response) => {
			store.dispatch({
				type   : SET_USER_DATA,
				payload: response.data
			})
		})

	}

	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {

		if (this.state.clicked) {
			var vname = encodeURIComponent(this.state.vname)
			var link = '/apps/dashboards/tagvideo/tagged/'+this.state.vid+'/'+vname
			return <Redirect to={link}/>
		}
	}

	render()
	{
		const {classes} = this.props;
		var props = this.props;
		const rows = [
			{ id: 'match_name', label: 'Match Name' },
			{ id: 'tournament', label: 'Opponent\'s Team Name' },
			{ id: 'match_type', label: 'Match Type' },
			{ id: 'player1_name', label: 'Player 1 Name' },
			{ id: 'player2_name', label: 'Player 2 Name' },
			{ id: 'state', label: 'Tagging State' },
		];
		return (


		<div style={{padding: 50}}>
			<Paper className={classes.root} >
				{this.renderRedirect()}
					<Table className={classes.table} aria-labelledby="tableTitle">
						<TableHead>
							<TableRow>
								{rows.map(
									row => (
										<TableCell
											key={row.id}
											align={'left'}
											padding={'default'}
											sortDirection={this.state.orderBy === row.id ? this.state.order : false}
										>
											<Tooltip
												title="Sort"
												placement={row.numeric ? 'bottom-end' : 'bottom-start'}
												enterDelay={300}
											>
												<TableSortLabel
													active={this.state.orderBy === row.id}
													direction={this.state.order}
													onClick={this.createSortHandler(row.id)}
												>
													{row.label}
												</TableSortLabel>
											</Tooltip>
										</TableCell>
										),
									this,
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{props.user.team.Videos.filter((video)=>{
								return video.state == "tagged"	
							}).map((video, index)=>
									(
								<TableRow
									hover
									onClick={() => {
											if(!((video.processedImageUri === null || video.processedImageUri === undefined || video.processedImageUri === ""))){
												this.setState({clicked: true, vid: video._id, vname: video.metadata.matchName})
											}
										} 
									}
								>
									<TableCell component="th" scope="row" align="left">
										{video.metadata.matchName}
									</TableCell>
									<TableCell align="left">
										{video.metadata.tournament}
									</TableCell>
									<TableCell align="left">
										{video.metadata.playerName2 == ""? "Single":"Double"}
									</TableCell>
									<TableCell align="left">
										{video.metadata.playerName1}
									</TableCell>
									<TableCell align="left">
										{video.metadata.playerName2 == ""? "N/A":video.metadata.playerName2}
									</TableCell>
									<TableCell align="left">
										{(video.state == "tagged" && video.splicedVideoUri!=undefined) ? "Tagged":"Untagged"}
									</TableCell>
					            </TableRow>
					          )
					        )}
					    </TableBody>
					  </Table>
				</Paper>
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Tagged)));
