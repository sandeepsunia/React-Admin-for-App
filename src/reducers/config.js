import {createReducer} from '../utils';
import { FETCH_API_CONFIG_REQUEST, SET_API_CONFIG, CONFIG_CLEAN } from '../constants';
import {pushState} from 'redux-router';

const initialState = {
    confId: '',
    isFetching: true
};

export default createReducer(initialState, {
    [SET_API_CONFIG]: (state, payload) => {
        return {
            ...state,
            confId: payload.data,
            isFetching: false
        }
    },
    [FETCH_API_CONFIG_REQUEST]: (state, payload) => {
        return {
            ...state,
            isFetching: true
        }
    },
    [CONFIG_CLEAN]: (state, payload) => {
        return {
            ...state,
            isFetching: false,
            confId: ''
        }
    }
});
