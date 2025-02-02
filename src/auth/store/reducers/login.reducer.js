import * as Actions from '../actions';

const initialState = {
    success: false,
    error  : null
};

const login = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.LOGIN_SUCCESS:
        {
            return {
                ...initialState,
                success: true
            };
        }
        case Actions.LOGIN_ERROR:
        {
            return {
                success: false,
                error  : "Login failure"
            };
        }
        default:
        {
            return state
        }
    }
};

export default login;