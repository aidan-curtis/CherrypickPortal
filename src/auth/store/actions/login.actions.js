import axios from 'axios/index';
import {setUserData} from 'auth/store/actions/user.actions';
import env from '../../../config'

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({email, password})
{

    var API_ENDPOINT = env.REACT_APP_API_ENDPOINT
    const request = axios({
        method: "POST",
        url: API_ENDPOINT + "/public_api/authenticate",
        responseType: 'json',
        data: {
            "email": email,
            "password": password
        }
    })

    return (dispatch) =>
        request.then((response) => {
            if ( response.data.success )
            {
                dispatch(setUserData(response.data));
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            }
            else
            {
                return dispatch({
                    type   : LOGIN_ERROR,
                    payload: response.data.error
                });
            }
        });
}


