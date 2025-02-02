import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import classNames from 'classnames';
import {Avatar, Button, Icon, ListItemIcon, ListItemText, MenuItem, Typography, Popover} from '@material-ui/core';
import {connect} from 'react-redux';
import deburr from 'lodash/deburr';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as authActions from 'auth/store/actions';
import {bindActionCreators} from 'redux';
import {FuseAnimate} from '@fuse';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import '../styles/filepond.css';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Paper from '@material-ui/core/Paper';
import axios from 'axios/index';
import store from 'store';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import env from '../config'
import { Redirect } from 'react-router-dom'
require('./materialize.css')


export const SET_USER_DATA = '[USER] SET DATA';


registerPlugin(FilePondPluginFileValidateType)

const styles = theme => ({
	root     : {
		display   : 'flex',
		alignItems: 'center',
		width     : '100%'
	},
	seperator: {
		width          : 1,
		height         : 64,
		backgroundColor: theme.palette.divider
	},
	suggestionsList:{
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	}

});


function renderInputComponent(inputProps) {
	const { classes, inputRef = () => {}, ref, ...other } = inputProps;
	return (
		<TextField
			fullWidth
			InputProps={{
			inputRef: node => {
				ref(node);
				inputRef(node);
			},
			classes: {
				input: classes.input,
			},
			}}
			{...other}
		/>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.label;
}


function renderSuggestion(suggestion, { query, isHighlighted }) {
	const matches = match(suggestion.label, query);
	const parts = parse(suggestion.label, matches);

	return (
		<MenuItem selected={isHighlighted} component="div">
			<div>
			{parts.map((part, index) => {
				return part.highlight ? (
				<span key={String(index)} style={{ fontWeight: 500 }}>
					{part.text}
				</span>
				) : (
				<strong key={String(index)} style={{ fontWeight: 310 }}>
					{part.text}
				</strong>
				);
			})}
			</div>
		</MenuItem>
	);
}



class MainToolbar extends Component {



	handleFinishedUpload = info => {
		console.log('File uploaded with filename', info.filename)
		console.log('Access it on s3 at', info.fileUrl)
	}

	// a little function to help us with reordering the result
	reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: 'none',
		padding: this.state.grid * 2,
		margin: `0 0 ${this.state.grid+2}px 0`,

		// change background colour if dragging
		background: 'white',
		borderRadius: "3px",
		boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 0px 0 rgba(0, 0, 0, 0.19)",


		// styles we need to apply on draggables
		...draggableStyle,
	});

	getListStyle = isDraggingOver => ({
		background: 'white',
		padding: this.state.grid,
		width: "100%",
	});



	
	getSuggestions(value) {
	  const inputValue = deburr(value.trim()).toLowerCase();
	  const inputLength = inputValue.length;
	  let count = 0;
	  return inputLength === 0
		? []
		: this.state.suggestions.filter(suggestion => {

			const keep =
			  count < 5 && ((suggestion.label.slice(0, inputLength).toLowerCase() === inputValue) || inputLength === 0);

			if (keep) {
			  count += 1;
			}

			return keep;
		  });
	}
	getNameSuggestions(value) {
		const inputValue = deburr(value.trim()).toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;
		return inputLength === 0
		? []
		: this.state.suggested_player_names.filter(suggestion => {
			if(suggestion.label === undefined){
				return false
			} else {
				const keep =
						  count < 5 && (suggestion.label.slice(0, inputLength).toLowerCase() === inputValue || inputLength === 0);
				if (keep) {
				  count += 1;
				}

				return keep;
			}
			
		});
	}



	state = {
		userMenu: null,
		player_name_1: "",
		player_name_2: "",
		tournament_name: "",
		match_name: "",
		upload_filenames: [],
		sortable_filenames: [],
		suggested_player_names: [],
		open: false,
		continued: 0,
		popper: '',
		suggestions: [],
		redirect:null,
		matchMode: 0,
		segment_video: true,
		grid: 6,
		warning_active: false
	};



	handleChangeSlider = (event, matchMode) => {

		this.setState({ matchMode });
	};

	handleChangeIndex = index => {
		this.setState({ matchMode: index });
	};

	refresh(){
		var token = this.props.user.token
		if(token === "" || token === undefined){
			token = localStorage.token
		}
		if(token === "" || token === undefined){
			//This person does not have a token. redirect to login
			this.setState({redirect: "/login"})
		}

		var final_this = this
		axios({
			method: "GET",
			url: env.REACT_APP_API_ENDPOINT + "/private_api/get_team",
			responseType: 'json',
			headers: {
				"authorization": token
			}
		}).then((response) => {
			this.props.user.team = response.data.team
			store.dispatch({
				type   : SET_USER_DATA,
				payload: response.data
			})
			this.load_suggestions(response.data.team, final_this)
		})
	}

	load_suggestions(team, final_this) {
		team.Videos.forEach(function(video){
			if(final_this.state.suggestions.filter(function(t){return t.label === video.metadata.tournament}).length === 0){
				final_this.state.suggestions.push({"label": video.metadata.tournament})
			}
			if(final_this.state.suggested_player_names.filter(function(t){return (t.label === video.metadata.playerName1) }).length === 0){
				final_this.state.suggested_player_names.push({"label": video.metadata.playerName1})
			}
			if(final_this.state.suggested_player_names.filter(function(t){return (t.label === video.metadata.playerName2) }).length === 0){
				final_this.state.suggested_player_names.push({"label": video.metadata.playerName2})
			}
		})
	}
	constructor(props){
		super()
		this.props = props
		this.refresh()
	}

	userMenuClick = event => {
		this.setState({userMenu: event.currentTarget});
	};
	uploadVideo = event => {
		if(this.props.user.team.Videos.length<this.props.user.team.tagCap){
			this.setState({open: true, continued: 0, upload_filenames: []})
		} else {
			this.setState({
				warning_active: true
			})
		}
	};
	userMenuClose = () => {
		this.setState({userMenu: null});
	};

	handleClose = () => {};
	handleRealClose = () => {
		this.setState({
			open: false, 
			upload_filenames: [], 
			continued: 0,
			tournament_name: "",
			player_name_1: "",
			player_name_2: "",
			match_name: ""
		});
	};


	handleWarningClose = () => {
		this.setState({
			warning_active: false
		});
	};



	handleCheckChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};


	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleServerResponse = response => {
		if(JSON.parse(response)["success"]){
			var upload_filenames = this.state.upload_filenames
			upload_filenames.push(JSON.parse(response)["file_info"][0])
			this.setState({
				upload_filenames: upload_filenames
			})
		}	
	}


	handleSubmitContinue = () => {
		this.setState({
			continued: 1
		})
	}

	handleSecondSubmitContinue = () => {
		this.setState({
			continued: 2
		})
	}

	handleSubmitForm = () => {
		axios({
			method: "POST",
			url: env.REACT_APP_API_ENDPOINT + "/private_api/create_video",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			},
			data: {
				"upload_filenames": this.state.upload_filenames.map(function(fn){return fn["location"]}),
				"upload_keys": this.state.upload_filenames.map(function(fn){return fn["key"]}),
				"tournament_name": this.state.tournament_name,
				"player_name_1": this.state.player_name_1,
				"player_name_2": this.state.player_name_2,
				"match_name": this.state.match_name,
				"process_video": this.state.segment_video,
				"match_mode": this.state.matchMode
			}
		}).then((response) => {
			this.setState({
				open: false,
				upload_filenames: [],
				tournament_name: "",
				player_name_1: "",
				player_name_2: "",
				match_name: "",
				continued: 0
			})
			this.refresh()
		})
	}


	handleSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	};

	handlePlayerNameSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggested_player_names: this.getNameSuggestions(value)
		});
	};

	handleSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
			suggested_player_names:[]
		});
	};

	handleAutosuggestChange = name => (event, { newValue }) => {
		this.setState({
			[name]: newValue,
		});
	};

	onDragEnd = (result) => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const upload_filenames = this.reorder(
			this.state.upload_filenames,
			result.source.index,
			result.destination.index
		);

		this.setState({
			upload_filenames,
		});

	}



	renderRedirect = () => {
		if(this.state.redirect !== null){
			this.setState({redirect: null})
			return (<Redirect to={this.state.redirect} />)
		} else {
			return null
		}
	
	}
	render()
	{
		
		const {classes, user, logout} = this.props;
		const {userMenu} = this.state;

		var  autosuggestProps = {
			renderInputComponent,
			suggestions: this.state.suggestions,
			onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
			onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
			getSuggestionValue,
			renderSuggestion,
		};
		var  autosuggestPropsPlayerName = {
			renderInputComponent,
			suggestions: this.state.suggested_player_names,
			onSuggestionsFetchRequested: this.handlePlayerNameSuggestionsFetchRequested,
			onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
			getSuggestionValue,
			renderSuggestion,
		};

		var instructions = [
			"What match are you uploading?",
			"Upload the videos for that match",
			"Order your videos from top to bottom."
		]
		var link = window.location.href.split("/")
		var d_idx = link.indexOf("dashboards")

		return (
			<div className={classNames(classes.root, "flex flex-row")}>
				{this.renderRedirect()}

				<Dialog
					open={this.state.warning_active}
					onClose={this.handleWarningClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">You've reached your match limit. If you'd like to extend your limit, please email james@cherrypick-analytics.com</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleWarningClose} color="primary" autoFocus>
							Close
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{instructions[this.state.continued]}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description" style={{ width: "420px"}}>
							{this.state.continued === 1?
								<FilePond 
									allowMultiple={true}
									name="content"
									style = {{fontSize: 50}}
									acceptedFileTypes = {["video/mp4","video/quicktime"]}
									server={{
											url: env.REACT_APP_API_ENDPOINT+'/private_api',
											process: {
												url: '/upload_video',
												method: 'POST',
												headers: {
													"authorization": localStorage.getItem("token")
												},
												withCredentials: false,
												onload: this.handleServerResponse,
												onerror: function(response) {
													return response.data;
												}
											}
									}}
									onremovefile={(file) => {

									}}
									
								/>
								: null
							}
							{this.state.continued === 1 && this.state.upload_filenames.length !== 0 ? 
								<div style={{marginTop: "20px", width: "410px"}}>
									<p style = {{marginTop: "10px", marginBottom: "10px", textAlign: "center"}}>
										Don't submit until all videos have finished uploading.
									</p>
									<Button variant="contained" onClick={this.handleSecondSubmitContinue} className={classes.button} style={{ width: "410px"}}>
										Submit
									</Button>
								</div>: null
							}
							{this.state.continued === 0 ?

								<FormControl component="fieldset">
									<FormGroup>
										<AppBar position="static" color="default">
											<Tabs
												value={this.state.matchMode}
												onChange={this.handleChangeSlider}
												indicatorColor="primary"
												textColor="primary"
												fullWidth
											>
												<Tab label="Singles" />
												<Tab label="Doubles" />
											</Tabs>
										</AppBar>

										<TextField
											id=""
											label="Date Played"
											value={this.state.match_name}
											onChange={this.handleChange('match_name')}
											margin="normal"
										/>

										<div style={{marginBottom: 10}}>
											<Autosuggest
												{...autosuggestPropsPlayerName}
												inputProps={{
													classes,
													label: 'Player Name',
													value: this.state.player_name_1,
													onChange: this.handleAutosuggestChange('player_name_1'),
												}}
												theme={{
													container: classes.container,
													suggestionsContainerOpen: classes.suggestionsContainerOpen,
													suggestionsList: classes.suggestionsList,
													suggestion: classes.suggestion,
												}}
												renderSuggestionsContainer={options => (
												<Paper {...options.containerProps} square>
													{options.children}
												</Paper>
												)}
											/>
										</div>
										{ this.state.matchMode === 1 ?
											<div style={{marginBottom: 10}}>
												<Autosuggest
													{...autosuggestPropsPlayerName}
													inputProps={{
														classes,
														label: 'Player Name',
														value: this.state.player_name_2,
														onChange: this.handleAutosuggestChange('player_name_2'),
													}}
													theme={{
														container: classes.container,
														suggestionsContainerOpen: classes.suggestionsContainerOpen,
														suggestionsList: classes.suggestionsList,
														suggestion: classes.suggestion,
													}}
													renderSuggestionsContainer={options => (
													<Paper {...options.containerProps} square>
														{options.children}
													</Paper>
													)}
												/>
											</div>:null
										}

										<Autosuggest
											{...autosuggestProps}
											inputProps={{
												classes,
												label: 'Opponent\'s Team Name',
												value: this.state.tournament_name,
												onChange: this.handleAutosuggestChange('tournament_name'),
											}}
											theme={{
												container: classes.container,
												suggestionsContainerOpen: classes.suggestionsContainerOpen,
												suggestionsList: classes.suggestionsList,
												suggestion: classes.suggestion,
											}}
											renderSuggestionsContainer={options => (
											<Paper {...options.containerProps} square>
												{options.children}
											</Paper>
											)}
										/>
									<FormControlLabel
										style={{marginTop: 20}}
										hidden
										control={
											<Checkbox
												checked={this.state.segment_video}
												onChange={this.handleCheckChange('segment_video')}
												value="segment_video"
												classes={{
													root: classes.root,
													checked: classes.checked,
												}}
												style={{width: 50}}
											/>
										}
										label="Segment Match"
									/>
									</FormGroup>
									

									<Button variant="contained" onClick={this.handleSubmitContinue} className={classes.button} style={{marginTop: 20, width: "420px"}}>
										Continue
									</Button>
								</FormControl> : null
							} 



							{
								this.state.continued === 2 ? 
								<FormControl>
									<DragDropContext onDragEnd={this.onDragEnd}  style={{width: "100%"}}>
										<Droppable droppableId="droppable" style={{width: "100%"}}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												style={this.getListStyle(snapshot.isDraggingOver)}
											>
												{this.state.upload_filenames.map(function(fn){return {
													id: `item-${fn['location']}`,
													content: `${fn["originalname"]}`,
												}}).map((item, index) => (
													<div style={{display: "flex",   flexWrap: "nowrap"}}>
														<div style = {{width: 30, paddingTop: 12}}>{index+1}.</div>
														<div style = {{width: "100%"}}>
														<Draggable key={item.id} draggableId={item.id} index={index}>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	style={this.getItemStyle(
																		snapshot.isDragging,
																		provided.draggableProps.style
																	)}
																>
																	{item.content}
																</div>
															)}
														</Draggable>
														</div>
													</div>
												))}
												{provided.placeholder}
											</div>
										)}
										</Droppable>
									</DragDropContext>
									<Button variant="contained" onClick={this.handleSubmitForm} className={classes.button} style={{marginTop: 20, width: "420px"}}>
										Continue
									</Button>
								</FormControl>:null
							}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleRealClose} color="primary" autoFocus>
							Stop Upload
						</Button>
					</DialogActions>
				</Dialog>
				<div className="flex flex-1"> 
					<nav style={{marginLeft: 20}}>
						{
							 link[d_idx+1] === "account_information"? (<a className="breadcrumb">Account Information</a>) : null							
						}
						{
							 link[d_idx+1] === "matches"? (<a className="breadcrumb">Matches</a>) : null
						}
						{
							 link[d_idx+2] === "untagged" || link[d_idx+1] === "untagged" ? (<a className="breadcrumb">Untagged</a>): null
						}
						{	
							 link[d_idx+2] === "tagged" || link[d_idx+1] === "tagged"  ? (<a  className="breadcrumb">Tagged</a>): null
						}
						{	
							 link[d_idx+2] === "quality" || link[d_idx+1] === "quality"  ? (<a  className="breadcrumb">Quality Check</a>): null
						}
						{
							 link.length>d_idx+3 && link[d_idx+1] !== "tagvideo" ? (<a className="breadcrumb">{decodeURIComponent(link[d_idx+2])} {decodeURIComponent(link[d_idx+3])} {link[d_idx+4] === "None"?"":"& "+decodeURIComponent(link[d_idx+4])}</a>) : null
						}
						{
							 link.length>d_idx+4 && link[d_idx+1] === "tagvideo" ? (<a className="breadcrumb">{decodeURIComponent(link[d_idx+4])}</a>) : null
						}
					</nav>
				</div>
				<div className="flex">
					<Button className="h-64" onClick={this.uploadVideo} hidden={user.team.role !== "team"}>
							<Icon className="text-16 ml-12 hidden sm:flex" variant="action">cloud_upload</Icon>
							<Typography component="span" className="normal-case font-500 flex">
								&nbsp; Upload Video
							</Typography>
					</Button>
					<FuseAnimate delay={310}>
						<Button className="h-64" onClick={this.userMenuClick}>
							{user.team.imageUri ?
								(
									<Avatar className="" alt="user photo" src={user.team.imageUri}/>
								)
								:
								(
									<Avatar className="">
										{user.team.team_name}
									</Avatar>
								)
							}
							<div className="hidden md:flex flex-col ml-12 items-start">
								<Typography component="span" className="normal-case font-500 flex">
									{user.team.team_name}
								</Typography>
								<Typography className="text-11 capitalize" color="textSecondary">
									Team
								</Typography>
							</div>
							<Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
						</Button>
					</FuseAnimate>

					<Popover
						open={Boolean(userMenu)}
						anchorEl={userMenu}
						onClose={this.userMenuClose}
						anchorOrigin={{
							vertical  : 'bottom',
							horizontal: 'center'
						}}
						transformOrigin={{
							vertical  : 'top',
							horizontal: 'center'
						}}
						classes={{
							paper: "py-8"
						}}
					>
						{(
							<React.Fragment>
								<MenuItem
									onClick={() => {
										logout();
										this.userMenuClose();
									}}
								>
									<ListItemIcon>
										<Icon>exit_to_app</Icon>
									</ListItemIcon>
									<ListItemText className="pl-0" primary="Logout"/>
								</MenuItem>
							</React.Fragment>
						)}
					</Popover>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch)
{
	return bindActionCreators({
		logout          : authActions.logoutUser
	}, dispatch);
}

function mapStateToProps({auth, location})
{
	return {
		user: auth.user,
		location: location
	}
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(MainToolbar));
