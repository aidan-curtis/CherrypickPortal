import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import classNames from 'classnames';
import {Avatar, Button, Icon, IconButton, ListItemIcon, ListItemText, MenuItem, Typography, Hidden, Popover} from '@material-ui/core';
import {connect} from 'react-redux';
import deburr from 'lodash/deburr';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as authActions from 'auth/store/actions';
import {bindActionCreators} from 'redux';
import {FuseShortcuts, FuseAnimate} from '@fuse';
import {Link} from 'react-router-dom';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios/index';
import store from 'store';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

export const SET_USER_DATA = '[USER] SET DATA';




registerPlugin(FilePondPluginFileValidateType)

const suggestions = [
];

const suggested_player_names = [
]

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
				<strong key={String(index)} style={{ fontWeight: 300 }}>
					{part.text}
				</strong>
				);
			})}
			</div>
		</MenuItem>
	);
}

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
function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
	? []
	: suggestions.filter(suggestion => {
		const keep =
		  count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

		if (keep) {
		  count += 1;
		}

		return keep;
	  });
}
function getNameSuggestions(value) {
	const inputValue = deburr(value.trim()).toLowerCase();
	const inputLength = inputValue.length;
	let count = 0;
	return inputLength === 0
	? []
	: suggested_player_names.filter(suggestion => {
		const keep =
		  count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

		if (keep) {
		  count += 1;
		}

		return keep;
	});
}



class MainToolbar extends Component {
	state = {
		userMenu: null,
		player_name: "",
		tournament_name: "",
		match_name: "",
		upload_filenames: [],
		suggested_player_names: [],
		open: false,
		continued: false,
		popper: '',
		suggestions: [],
		num_files:0
	};



	refresh(){
		axios({
			method: "GET",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/get_team",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			}
		}).then((response) => {
			store.dispatch({
				type   : SET_USER_DATA,
				payload: response.data
			})
		})
	}

	load_suggestions(props){
		props.user.team.Videos.forEach(function(video){
			if(suggestions.filter(function(t){return t.label===video.metadata.tournament}).length===0){
				suggestions.push({"label": video.metadata.tournament})
			}
			if(suggested_player_names.filter(function(t){return t.label===video.metadata.playerName}).length===0){
				suggested_player_names.push({"label": video.metadata.playerName})
			}
		})
	}
	constructor(props){
		super()
		this.load_suggestions(props)
		this.refresh()
	}

	userMenuClick = event => {
		this.setState({userMenu: event.currentTarget});
	};
	uploadVideo = event => {
		this.setState({open: true, continued: false, upload_filenames: []})
	};
	userMenuClose = () => {
		this.setState({userMenu: null});
	};
	handleClose = () => {
		this.setState({
			open: false, 
			upload_filenames: [], 
			continued: false,
			tournament_name: "",
			player_name: "",});
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleServerResponse = response => {
		if(JSON.parse(response)["success"]){
			var upload_filenames = this.state.upload_filenames
			upload_filenames.push(JSON.parse(response)["file_info"][0]["location"])
			this.setState({
				upload_filenames: upload_filenames,
				num_files: this.state.num_files-1
			})
		}	
	}


	handleSubmitContinue = () => {
		this.setState({
			continued: true
		})
	}
	handleSubmitForm = () => {

		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/create_video",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			},
			data: {
				"upload_filenames": this.state.upload_filenames,
				"tournament_name": this.state.tournament_name,
				"player_name": this.state.player_name
			}
		}).then((response) => {
			this.setState({
				open: false,
				upload_filenames: [],
				tournament_name: "",
				player_name: "",
				continued: false
			})
			this.refresh()
		})


	}


	handleSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: getSuggestions(value)
		});
	};

	handlePlayerNameSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggested_player_names: getNameSuggestions(value)
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



	render()
	{

		const {classes, user, logout, openChatPanel} = this.props;
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
		return (
			<div className={classNames(classes.root, "flex flex-row")}>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{ this.state.upload_filenames.continued==false? "What match are you uploading?": "Upload the videos for that match"}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							
							{this.state.continued == true?
								<FilePond 
									allowMultiple={true}
									name="content"
									acceptedFileTypes = {["video/mp4"]}
									server={{
											url: process.env.REACT_APP_API_ENDPOINT+'/private_api',
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
									onaddfilestart={(file) => {
										this.setState({
											num_files: this.state.num_files+1
										})
										// Set current file objects to this.state
										
									}}
					
								/>
								: null
							}
							{this.state.num_files==0 && this.state.continued == true && this.state.upload_filenames.length != 0 ? 
								<Button variant="contained" onClick={this.handleSubmitForm} className={classes.button} style={{marginTop: "20px", width: "300px"}}>
									Submit
								</Button>: null
							}
							{this.state.continued == false ?
								<FormControl component="fieldset">
									<FormGroup>
										<TextField
											id=""
											label="Match Name"
											style={{width: "300px"}}
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
													value: this.state.player_name,
													onChange: this.handleAutosuggestChange('player_name'),
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

										<Autosuggest
											{...autosuggestProps}
											inputProps={{
												classes,
												label: 'Tournament Name',
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
									</FormGroup>
									<Button variant="contained" onClick={this.handleSubmitContinue} className={classes.button} style={{marginTop: 35, width: "300px"}}>
										Continue
									</Button>
								</FormControl> : null
							}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
							<Button onClick={this.handleClose} color="primary" autoFocus>
								Close
							</Button>
					</DialogActions>
				</Dialog>
				<div className="flex flex-1"> </div>
				<div className="flex">
					<Button className="h-64" onClick={this.uploadVideo}>
							<Icon className="text-16 ml-12 hidden sm:flex" variant="action">cloud_upload</Icon>
							<Typography component="span" className="normal-case font-500 flex">
								&nbsp; Upload Video
							</Typography>
					</Button>
					<FuseAnimate delay={300}>
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

function mapStateToProps({auth})
{
	return {
		user: auth.user
	}
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(MainToolbar));
