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
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';


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
		userMenu: null
	};
	constructor(){
		super()
		
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
		this.setState({open: false});
	};

	render()
	{
		const {classes, user, logout, openChatPanel} = this.props;
		const {userMenu} = this.state;

		return (
			<div className={classNames(classes.root, "flex flex-row")}>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{"Upload a video for segmentation."}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<FilePond 
							server={{
									url: 'http://54.152.39.99:5002/private_api',
									timeout: 7000,
									process: {
										url: '/upload_video',
										method: 'POST',
										headers: {
											"authorization": localStorage.getItem("token")
										},
										withCredentials: false,
										onload: function(response) {
											return response.key;
										},
										onerror: function(response) {
											return response.data;
										}
									}
								}}
							 name="content"/>
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
