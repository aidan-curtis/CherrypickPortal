import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as Actions from 'auth/store/actions';


const styles = theme => ({
	root: {
		width: '100%'
	}
});

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort(array, cmp) {
	console.log(array)
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
	const order = cmp(a[0], b[0]);
	if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	console.log(orderBy)
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


class Matches extends Component {

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
		if(props.user.activePlayer !== null){
			this.props.setCurrentPlayer(props.user.activePlayer)
		}
		if(props.user.activeTournament !== null){
			this.props.setCurrentTournament(props.user.activeTournament)
		}
	}

	redirectToTarget = () => {
		this.props.history.push(`/apps/dashboards/video`)
	}


	renderRedirect = () => {
		if (this.state.clicked) {
			// Need to replace slashes because urls are parsed by slash
			var encoded_vname = encodeURIComponent(this.state.vname)
			var encoded_pname1 = encodeURIComponent(this.state.pname1)
			if(this.state.pname2 === "" || this.state.pname2 === undefined){
				this.setState({
					pname2: "None"
				})
			}
			var encoded_pname2 = encodeURIComponent(this.state.pname2)
			var link = '/apps/dashboards/video/'+encoded_vname+'/'+encoded_pname1+'/'+encoded_pname2+"/"+this.state.vid
			return <Redirect to={link}/>
		}
	}

	render()
	{
		const {classes} = this.props;
		var props = this.props;


		const rows = [
			{ id: 'matchName', label: 'Date' },
			{ id: 'tournament', label: 'Opponent\'s Team Name' },
			{ id: 'matchMode', label: 'Match Type' },
			{ id: 'playerName1', label: 'Player 1 Name' },
			{ id: 'playerName2', label: 'Player 2 Name' },
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
							{stableSort(props.user.team.Videos, getSorting(this.state.order, this.state.orderBy)).map((video) => {
								video.matchName = video.metadata.matchName
								video.playerName1 = video.metadata.playerName1
								if(video.metadata.playerName2 !== undefined){
									video.playerName2 = video.metadata.playerName2
								} else {
									video.playerName2 = ""
								}
								video.tournament = video.metadata.tournament
								video.matchMode = (video.metadata.matchMode === "doubles" || video.metadata.playerName2 !== "")?"Doubles": "Singles"

								return (
									<TableRow
										hover
										onClick={() => {
												if(!((video.processedImageUri === null || video.processedImageUri === undefined || video.processedImageUri === ""))){
													this.setState({clicked: true, vid: video._id, vname: video.metadata.matchName, pname1: video.metadata.playerName1, pname2: video.metadata.playerName2})
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
											{(video.metadata.matchMode === "doubles" || video.metadata.playerName2 !== "")?"Doubles": "Singles"}
										</TableCell>
										<TableCell align="left">
											{video.metadata.playerName1}
										</TableCell>
										<TableCell align="left">
											{video.metadata.playerName2 === ""? "N/A":video.metadata.playerName2}
										</TableCell>
										<TableCell align="left">
											{(video.state === "tagged" && video.splicedVideoUri !== undefined) ? "Tagged":"Untagged"}
										</TableCell>
						            </TableRow>
					          	)
								
					        })}
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Matches)));
