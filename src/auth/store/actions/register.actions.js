import axios from 'axios/index';
import * as UserActions from 'auth/store/actions';
import * as Actions from 'store/actions';

export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export function submitRegister({displayName, password, email})
{
    const request = axios.post('/api/auth/register', {
        displayName,
        password,
        email
    });

    return (dispatch) =>
        request.then((response) => {
            if ( !response.data.error )
            {
                dispatch(UserActions.setUserData(response.data));
                return dispatch({
                    type: REGISTER_SUCCESS
                });
            }
            else
            {
                return dispatch({
                    type   : REGISTER_ERROR,
                    payload: response.data.error
                });
            }
        });
}


