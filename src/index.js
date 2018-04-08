import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import {loginUserSuccess, setApiConfig, fetchConferencesData} from './actions';

const target = document.getElementById('root');
const store = configureStore(window.__INITIAL_STATE__);

const node = (
    <Root store={store} />
);

let token = localStorage.getItem('token');
let confId = localStorage.getItem('confId');

if (token !== null) {
    store.dispatch(loginUserSuccess(token));
}

if (confId !== null) {
    store.dispatch(setApiConfig(confId));
    store.dispatch(fetchConferencesData(token, confId));
}
ReactDOM.render(node, target);
