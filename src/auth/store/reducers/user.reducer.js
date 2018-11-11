import * as Actions from '../actions';

const initialState = {
	team: {
		Videos: [],
		team_name: "",
		imageUri: "",
		email: ""
	},
	activeVideo: null,
	activePlayer: null,
	activeTournament: null,
	bc_title: "Tournaments",
	token: ""
};

const user = function (state = initialState, action) {

	switch ( action.type )
	{
		case Actions.SET_USER_DATA:
		{
			return {
				...initialState,
				...action.payload
			};
		}
		case Actions.REMOVE_USER_DATA:
		{
			return {
				...initialState
			};
		}
		case Actions.USER_LOGGED_OUT:
		{
			return initialState;
		}
		case Actions.SET_CURRENT_VIDEO:
			return {
				...state,
				activeVideo: action.payload
			}
		case Actions.SET_CURRENT_TOURNAMENT:
			return {
				...state,
				activeTournament: action.payload,
				activePlayer: null,
				activeVideo: null
		}
		case Actions.SET_CURRENT_PLAYER:
			return {
				...state,
				activePlayer: action.payload,
				activeTournament: null,
				activeVideo: null
		}
		case Actions.SET_BC_TITLE:
			return{
				...state,
				bc_title: action.payload,
				activePlayer: null,
				activeTournament: null
			}
		default:
		{
			return state
		}
	}
};

export default user;
