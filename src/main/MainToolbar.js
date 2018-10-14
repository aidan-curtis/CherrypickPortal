import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import classNames from 'classnames';
import {Avatar, Button, Icon, IconButton, ListItemIcon, ListItemText, MenuItem, Typography, Hidden, Popover} from '@material-ui/core';
import {connect} from 'react-redux';
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
import FormLabel from '@material-ui/core/FormLabel';
import axios from 'axios/index';
import store from 'store';

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
	}
});

class MainToolbar extends Component {
	state = {
		userMenu: null,
		player_name: "",
		tournament_name: "",
		upload_filename: "",
		open: false
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
	constructor(){
		super()
		this.refresh()
	}

	userMenuClick = event => {
		this.setState({userMenu: event.currentTarget});
	};
	uploadVideo = event => {
		this.setState({open: true})
	};
	userMenuClose = () => {
		this.setState({userMenu: null});
	};
	handleClose = () => {
		this.setState({open: false, upload_filename: ""});
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleServerResponse = response => {
		if(JSON.parse(response)["success"]){
			this.setState({
				upload_filename: JSON.parse(response)["filename"]
			})
		}	
	}

	handleSubmitForm = () => {
		console.log("submitting")
		console.log(this.state.upload_filename)
		axios({
			method: "POST",
			url: process.env.REACT_APP_API_ENDPOINT + "/private_api/create_video",
			responseType: 'json',
			headers: {
				"authorization": localStorage.token
			},
			data: {
				"upload_filename": this.state.upload_filename,
				"tournament_name": this.state.tournament_name,
				"player_name": this.state.player_name
			}
		}).then((response) => {
			this.setState({
				open: false,
				upload_filename: ""
			})
			this.refresh()
		})
	}

	render()
	{

		const {classes, user, logout, openChatPanel} = this.props;
		const {userMenu} = this.state;
		console.log(user)
		return (
			<div className={classNames(classes.root, "flex flex-row")}>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{ this.state.upload_filename == ""? "Upload a video for segmentation.": "Input Video Metadata"}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<FilePond 
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
							/>
							{this.state.upload_filename != "" ?
								<FormControl component="fieldset">
									<FormGroup>
										<TextField
											id=""
											label="Tournament Name"
											style={{width: "300px"}}
											value={this.state.tournament_name}
											onChange={this.handleChange('tournament_name')}
											margin="normal"

										/>
										<TextField
											id="player_name"
											label="Player Name"
											value={this.state.player_name}
											onChange={this.handleChange('player_name')}
											margin="normal"
										/>
									</FormGroup>
									<Button variant="contained" onClick={this.handleSubmitForm} className={classes.button} style={{marginTop: "20px", width: "300px"}}>
        								Submit
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
