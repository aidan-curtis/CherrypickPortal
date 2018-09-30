import * as Actions from '../actions';

const initialState = {
    team: {
        Videos: [],
        team_name: "",
        imageUri: "",
        email: ""
    },
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
        default:
        {
            return state
        }
    }
};

export default user;
