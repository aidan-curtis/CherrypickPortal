import * as Actions from '../actions';

const initialState = {
    team: {
        Videos: [],
        team_name: "",
        imageUri: "",
        email: ""
    },
    activeVideo: null,
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
        default:
        {
            return state
        }
    }
};

export default user;
