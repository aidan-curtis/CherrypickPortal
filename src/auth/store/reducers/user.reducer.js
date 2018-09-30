import * as Actions from '../actions';

const initialState = {
    team: {
        Videos: [],
        team_name: "",
        imageUri: "",
        email: ""
    },
    activeVideo: {
        Segments: [
        {name: "testing", timestamp: 5},
        {name: "testing2", timestamp: 10},
        {name: "testing", timestamp: 15},
        {name: "testing2", timestamp: 20},
        {name: "testing2", timestamp: 25},
        {name: "testing2", timestamp: 30},
        {name: "testing2", timestamp: 35},
        {name: "testing2", timestamp: 40},
        {name: "testing2", timestamp: 45},
        {name: "testing2", timestamp: 50},
        {name: "testing2", timestamp: 55},
        {name: "testing2", timestamp: 60},
        {name: "testing2", timestamp: 65},
        {name: "testing2", timestamp: 70},
        {name: "testing2", timestamp: 75},
        {name: "testing2", timestamp: 80},
        {name: "testing2", timestamp: 85}
         ]
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
