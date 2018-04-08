import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkSuccess(response) {
    let { success } = response
    if (success) {
        return response
    } else {
        var error = new Error('Failed to fetch data')
        error.response = response
        throw error
    }
}

export function fetchData(response) {
    let { responseObject } = response
    return responseObject.data
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
    return response.json()
}
