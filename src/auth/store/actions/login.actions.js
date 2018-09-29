import axios from 'axios/index';
import {setUserData} from 'auth/store/actions/user.actions';
import * as Actions from 'store/actions';
import { API_ENDPOINT } from '../../../config';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({email, password})
{

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


