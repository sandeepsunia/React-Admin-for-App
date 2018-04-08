import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';
import auth from './auth';
import data from './data';
import config from './config';

export default combineReducers({
 auth,
 config,
 data,
 router: routerStateReducer
});
