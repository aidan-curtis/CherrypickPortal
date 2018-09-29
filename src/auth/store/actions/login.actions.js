import axios from 'axios/index';
import firebaseService from 'firebaseService';
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

export function loginWithFireBase({username, password})
{
    return (dispatch) =>
        firebaseService.auth.signInWithEmailAndPassword(username, password)
            .then(() => {
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            })
            .catch(error => {
                const usernameErrorCodes = [
                    'auth/email-already-in-use',
                    'auth/invalid-email',
                    'auth/operation-not-allowed',
                    'auth/user-not-found',
                    'auth/user-disabled'
                ];
                const passwordErrorCodes = [
                    'auth/weak-password',
                    'auth/wrong-password'
                ];

                const response = {
                    username: usernameErrorCodes.includes(error.code) ? error.message : null,
                    password: passwordErrorCodes.includes(error.code) ? error.message : null
                };

                if ( error.code === 'auth/invalid-api-key' )
                {
                    dispatch(Actions.showMessage({message: error.message}));
                }

                return dispatch({
                    type   : LOGIN_ERROR,
                    payload: response
                });
            });
}
