import * as Actions from '../actions';

const initialState = {
    team: {
        team_name: "",
        imageUri: "",
        email: ""
    },
    Videos: [],
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
