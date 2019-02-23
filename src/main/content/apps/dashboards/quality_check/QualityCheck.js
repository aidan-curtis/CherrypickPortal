import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom'
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
import env from '../../../../../config'

export const SET_USER_DATA = '[USER] SET DATA';

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



class QualityCheck extends Component {

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
		this.state['type'] = decodeURIComponent(props.match.params.type)
		this.state['name'] = decodeURIComponent(props.match.params.name)
		var token = this.props.user.token
		if(token === "" || token === undefined){
			token = localStorage.token
		}
		axios({
			method: "GET",
			url: env.REACT_APP_API_ENDPOINT + "/private_api/get_team",
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
			var link = '/apps/dashboards/video_quality/tagged/'+this.state.vid+'/'+vname
			return <Redirect to={link}/>
		}
	}




	render()
	{
		

		const {classes} = this.props;
		var props = this.props;

		const rows = [
			{ id: "_id", label: 'ID' },
			{ id: "matchName", label: 'Date' },
			{ id: "tagger_email", label: 'Tagged' },
			{ id: "state", label: 'Tagging State' },
			{ id: "team_email", label: 'Uploader' }
		];
		return (
			<div style={{padding: 50}}>
				<Paper className={classes.root} bodyStyle={{overflow:'visible'}}>
					{this.renderRedirect()}
					<Table className={classes.table} aria-labelledby="tableTitle" >
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
						{stableSort(props.user.team.Videos.filter((video)=>{
							return video.state === "quality"
						}), getSorting(this.state.order, this.state.orderBy)).map((video) => {

								video.tagger_email = video.tagger.email
								video.matchName = video.metadata.matchName
								if(video.Team !== undefined){
									video.team_email = video.Team.email
								} else {
									video.team_email = ""
								}
								return (
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
											{video._id}
										</TableCell>
										<TableCell component="th" scope="row" align="left">
											{video.metadata.matchName}
										</TableCell>
										<TableCell component="th" scope="row" align="left">
											{video.tagger.email}
										</TableCell>
										<TableCell align="left">
											Quality Check
										</TableCell>
										<TableCell component="th" scope="row" align="left">
											{video.Team === undefined? "": video.Team.email}
										</TableCell>
									</TableRow>
								)
							})
						}
				
								
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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(QualityCheck)));
