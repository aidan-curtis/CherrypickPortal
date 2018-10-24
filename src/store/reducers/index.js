import {combineReducers} from 'redux';
import fuse from './fuse';
import auth from 'auth/store/reducers';

const rootReducer = combineReducers({
    auth,
    fuse
});

export default rootReducer;
