import history from 'history.js';
import {setDefaultSettings} from 'store/actions/fuse';
import {FuseDefaultSettings} from '@fuse';
import _ from 'lodash';
import store from 'store';
import * as Actions from 'store/actions';


export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const SET_CURRENT_VIDEO = '[USER] SET CURRENT VIDEO'
export const SET_CURRENT_TOURNAMENT = '[USER] SET CURRENT TOURNAMENT'
export const SET_CURRENT_PLAYER = '[USER] SET CURRENT PLAYER'
export const SET_BC_TITLE = '[USER] SET CURRENT BREADCRUMB TITLE'


/**
 * Set User Data
 */
export function setUserData(user)
{
	return (dispatch) => {
		/*
			Set User Settings
		 */
		dispatch(setDefaultSettings(user));

		/*
			Store token for authorization
		*/
		localStorage.setItem("token",user.token)

		/*
			Set User Data
		 */
		dispatch({
			type   : SET_USER_DATA,
			payload: user
		})
	}
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings)
{
	return (dispatch, getState) => {
		const oldUser = getState().auth.user;
		const user = _.merge({}, oldUser, {data: {settings}});

		updateUserData(user);

		return dispatch(setUserData(user));
	}
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts)
{
	return (dispatch, getState) => {
		const user = getState().auth.user;
		const newUser = {
			...user,
			data: {
				...user.data,
				shortcuts
			}
		};

		updateUserData(newUser);

		return dispatch(setUserData(newUser));
	}
}

/**
 * Remove User Data
 */
export function removeUserData()
{
	return {
		type: REMOVE_USER_DATA
	}
}

export function setCurrentVideo(value)
{
	return {
		type: SET_CURRENT_VIDEO,
		payload: value
	}
}

export function setCurrentTournament(value)
{
	return {
		type: SET_CURRENT_TOURNAMENT,
		payload: value
	}
}

export function setCurrentPlayer(value)
{
	return {
		type: SET_CURRENT_PLAYER,
		payload: value
	}
}

export function clearCurrentVideo()
{
	return {
		type: SET_CURRENT_VIDEO,
		payload: undefined
	}
}



/**
 * Logout
 */
export function logoutUser()
{
	history.push({
		pathname: '/'
	});

	localStorage.setItem("token", undefined)

	return (dispatch, getState) => {
		const user = getState().auth.user;
		dispatch(setDefaultSettings(FuseDefaultSettings));
		dispatch({
			type: USER_LOGGED_OUT,
			user: null,
		})
	}
}

export function setTournamentFilterPage(){
	return {
		type: SET_BC_TITLE,
		payload: "Tournaments"
	}
}
export function setPlayerFilterPage(){
	return {
		type: SET_BC_TITLE,
		payload: "Players"
	}
}
/**
 * Update User Data
 */
function updateUserData(user)
{
	if ( user.role === 'guest' )
	{
		return;
	}

	switch ( user.from )
	{
		default:
		{
		}
	}
}
