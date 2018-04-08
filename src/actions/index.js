'user strict'

import { checkHttpStatus, parseJSON, checkSuccess, fetchData } from '../utils';
import { 
  LOGIN_USER_REQUEST, 
  LOGIN_USER_FAILURE, 
  LOGIN_USER_SUCCESS, 
  LOGOUT_USER, 
  FETCH_PROTECTED_DATA_REQUEST,
  RECEIVE_PROTECTED_DATA,
  FETCH_USERS_DATA_REQUEST,
  RECEIVE_USERS_DATA,
  FETCH_API_CONFIG_REQUEST,
  RECEIVE_API_CONFIG,
  SET_API_CONFIG,
  RECEIVE_EVENTS_DATA,
  FETCH_EVENTS_DATA_REQUEST,
  RECEIVE_CONFERENCES_DATA,
  FETCH_CONFERENCES_DATA_REQUEST,
  RECEIVE_TRACKS_DATA,
  FETCH_TRACKS_DATA_REQUEST,
  DELETE_TRACKS_DATA_REQUEST,
  CONFIG_CLEAN,
  CREATE_CONFERENCE_REQUEST,
  UPDATE_CONFERENCES_DATA,
  UPDATE_CONFERENCES_DATA_DONE,
  RECEIVE_MATCHED_EVENTS_DATA,
  FETCH_DRAFTS_DATA_REQUEST,
  RECEIVE_DRAFTS_DATA,
  RECEIVE_MATCHED_DRAFTS_DATA,
  DELETE_USER_FROM_STATE,
  EDIT_USER_MODAL,
  TOGGLE_MODAL,
  SET_EDIT_MODE,
  FLUSH_CURRENT_USER,
  EDIT_EVENT_MODAL,
  FLUSH_CURRENT_EVENT,
  SUBMIT_ERROR,
  RECEIVE_MATCHED_USERS_DATA,
  RECEIVE_SPEAKERS_DATA,
  SET_AUTOSAVE_DRAFT_ID
 } from '../constants';
import { pushState } from 'redux-router';
import jwtDecode from 'jwt-decode';
import querystring from 'querystring';

const HOST = `http://localhost:3001`
const BASE_URI = `${HOST}/api/v1`


export function loginUserSuccess(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', user);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token,
      user: user
    }
  }
}

export function loginUserFailure(error) {
  localStorage.removeItem('token');
  localStorage.removeItem('confId');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_USER
  }
}

export function configClean() {
  localStorage.removeItem('confId');
  return {
    type: CONFIG_CLEAN
  }
}

export function logoutAndRedirect() {
  return (dispatch, state) => {
    dispatch(logout());
    dispatch(configClean());
    dispatch(pushState(null, '/login'));
  }
}

export function fetchApiConfigRequest() {
  return {
    type: FETCH_API_CONFIG_REQUEST
  }
}
export function requestFailure(error) {
  return (dispatch, state) => {
    console.log(`Request failed due to ${error}`)
  }
}

export function submitError(error) {
  return {
    type: SUBMIT_ERROR,
    payload: {
      error: error
    }
  }
}
export function deleteUserFromState(userId) {
  return {
    type: DELETE_USER_FROM_STATE,
    payload: {
      userId: userId,
      idFetching: false
    }
  }
}

export function postEditUser(userId, data, token, redirect='/users') {
  return function(dispatch, state) {
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    }
    return fetch(`${BASE_URI}/user/${userId}/update`, {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: formData
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let { success } = response;
      if (success) {
        dispatch(pushState(null, redirect));
        dispatch(toggle(true));
        dispatch(fetchUsersData(token));
      }
    })
    .catch(e => dispatch(requestFailure(e.message)));
  }
}

export function postCreateUser(data, token, redirect='/users') {
  const { name, email, password, speaker, title, bio, affiliation, abstract, talkTitle, contact } = data;
  return function (dispatch, state) {
    let payload = {
      name: name,
      email: email,
      password: password,
      title: title,
      bio: bio,
      affiliation: affiliation,
      contact: contact,
      abstract: speaker ? abstract : '',
      talkTitle: speaker ? talkTitle : '',
      speaker: speaker
    }
    return fetch(`${BASE_URI}/user/register`, {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': token
     },
     body: querystring.stringify(payload)
     })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let { success, message } = response;
      if (success) {
        dispatch(pushState(null, redirect));
        dispatch(toggle(true));
        dispatch(fetchUsersData(token));
      }
      else {
        dispatch(submitError(message));
      }
    })
    .catch(e => dispatch(requestFailure(e.message)))
  }
}

export function uploadUsers(formdata, token, redirect='/users') {
  const data = formdata
  const upload = 1
  return function (dispatch, state) {
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    }
    return fetch(`${BASE_URI}/user/uploadCsv`, {
      method: 'POST',
      headers: {
      'Authorization': token
     },
     body: formData
     })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let { success, message } = response;
      if (success) {
        dispatch(toggle(true));
        dispatch(fetchUsersData(token, upload));
        dispatch(pushState(null, redirect));
      }
    })
    .catch(e => dispatch(requestFailure(e.message)))
  }
}

export function toggle(val) {
  return {
    type: TOGGLE_MODAL,
    payload: {
      toggle: !val
      //autosaveDraftId: ''
    }
  }
}

export function flushUser() {
  return {
    type: FLUSH_CURRENT_USER,
    payload: {
      currentUser: {}
    }
  }
}

export function flushEvent() {
  return {
    type: FLUSH_CURRENT_EVENT
  }
}

export function setEditMode(val, trackId=0) {
  return {
    type: SET_EDIT_MODE,
    payload: {
      editMode: val,
      trackId: trackId
    }
  }
}


export function editUser(currentUser, token) {
  return {
    type: EDIT_USER_MODAL,
    payload: {
      editMode: true,
      currentUser: currentUser,
      token: token
    }
  }
}

export function addUser(currentUser, token) {
  return {
    type: EDIT_USER_MODAL,
    payload: {
      editMode: false,
      currentUser: currentUser,
      token: token
    }
  }
}

export function editEvent(currentEvent, token) {
  return {
    type: EDIT_EVENT_MODAL,
    payload: {
      editMode: true,
      currentEvent: currentEvent,
      token: token
    }
  }
}

export function deleteUser(userId, token) {
  return function (dispatch, state) {
    return fetch(`${BASE_URI}/user/${userId}/delete`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      },
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let { success } = response;
      if (success) {
        dispatch(deleteUserFromState(userId))
      } else {
       console.log(`Something went wrong.`) 
      }
    })
    .catch(error => {
      dispatch(requestFailure(error.message));
    })
  }
}

export function deleteEvent(eventId, token, confId, showDraft='') {
  return function (dispatch, state) {
    return fetch(`${BASE_URI}/event/${eventId}/delete`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      },
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let { success } = response;
      if (success) {
        if (showDraft)
          dispatch(fetchDraftsData(token, confId))
        else
          dispatch(fetchEventsData(token, confId))
      } else {
       console.log(`Something went wrong.`) 
      }
    })
    .catch(error => {
      dispatch(requestFailure(error.message));
    })
  }
}

export function loginUser(email, password, redirect = "/dashboard") {
  return function (dispatch, state) {
    dispatch(loginUserRequest());
    let payload = {
      email: email,
      password: password
    };
    return fetch(`${BASE_URI}/user/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(payload)
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        let { success, responseObject } = response;
        let { token } = responseObject.data[0];
        try {
          let decodedUser = jwtDecode(token);
          dispatch(loginUserSuccess(token, decodedUser));
          dispatch(fetchApiConfig(token))
        } catch (e) {
          dispatch(loginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token'
            }
          }));
        }
      })
      .catch(error => {
        dispatch(loginUserFailure(error));
      })
  }
}

export function setApiConfig(confId) {
  localStorage.setItem('confId', confId);
  return {
    type: SET_API_CONFIG,
    payload: {
      data: confId
    }
  }
}

export function fetchApiConfig(token, initialize=false, trackTitle, startDate, endDate) {
  return function (dispatch, state) {
    dispatch(fetchApiConfigRequest())
    return fetch(`${BASE_URI}/config`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    })
    .then(parseJSON)
    .then(response => {
        let { success, responseObject } = response;
        let config = responseObject.data[0];
        if (Object.keys(config).length === 0){
          dispatch(pushState(null, '/initialize'))
        }else {
          dispatch(setApiConfig(config.conferenceId))
          if(initialize) {
            dispatch(createTrack(token, config.conferenceId, trackTitle, startDate, endDate))
            dispatch(pushState(null, '/events'))
          }
          if (!initialize) {
            dispatch(fetchConferencesData(token, config.conferenceId))
            dispatch(pushState(null, '/dashboard'))
          }
        }
    })
  }
}

export function createConferenceRequest() {
  return {
    type: CREATE_CONFERENCE_REQUEST
  }
}


export function createConference(token, formData) {
  const data = formData
  const trackTitle = formData.trackTitle
  const startDate = formData.trackStartDate
  const endDate = formData.trackEndDate
  return function (dispatch, state) {
    dispatch(createConferenceRequest())
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    }    
    return fetch(`${BASE_URI}/conference/create`, {
      method: 'POST',
      headers: {
        'Authorization': `${token}`
      },
      body: formData
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => { dispatch(fetchApiConfig(token, true, trackTitle, startDate, endDate)) })
  };   
}

export function updateConferenceRequestDone(conferences) {
  return {
    type: UPDATE_CONFERENCES_DATA_DONE,
    payload: {
      data: conferences,
      isUpdating: false
    }
  }
}

export function updateConferenceRequest() {
  return {
    type: UPDATE_CONFERENCES_DATA,
    payload: {
      isUpdating: true
    }
  }
}

export function updateConference(token, confId, formData) {
  
  const data = formData
  return function (dispatch, state) {
    dispatch(updateConferenceRequest())
    const formData = new FormData()
    for(var name in data) {
    formData.append(name, data[name]);
  }
  return fetch(`${BASE_URI}/conference/${confId}/update`, {
    method: 'POST',
    headers: {
      'Authorization': `${token}`
    },
    body: formData
  })
    .then(checkHttpStatus)
    .then(parseJSON) 
    .then(checkSuccess)         
    .then(fetchData)
    .then(conferences => { dispatch(updateConferenceRequestDone(conferences))})
    .catch(error => {
      dispatch(submitError(error));
      dispatch(pushState(null, '/conferences'));
    })
  }
}

export function receiveProtectedData(data) {
  return {
    type: RECEIVE_PROTECTED_DATA,
    payload: {
      data: data
    }
  }
}

export function receiveUsers(users, upload=0) {
  return {
    type: RECEIVE_USERS_DATA,
    payload: {
      data: users,
      uploadMessage: upload==1 ? 'Users uploaded successfully' : '',
      isFetching: false
    }
  }
}

export function receiveSpeakers(users) {
  return {
    type: RECEIVE_SPEAKERS_DATA,
    payload: {
      data: users,
      isFetching: false
    }
  }
}

export function receiveMatchedUsers(users) {
  return {
    type: RECEIVE_MATCHED_USERS_DATA,
    payload: {
      data: users,
      isFetching: false
    }
  }
}

export function receiveEvents(events) {
  return {
    type: RECEIVE_EVENTS_DATA,
    payload: {
      data: events,
      isFetching: false
    }
  }
}

export function receiveDrafts(drafts) {
  return {
    type: RECEIVE_DRAFTS_DATA,
    payload: {
      data: drafts,
      isFetching: false
    }
  }
}

export function receiveMatchedEvents(events) {
  return {
    type: RECEIVE_MATCHED_EVENTS_DATA,
    payload: {
      data: events,
      draftPage: '',
      isFetching: false
    }
  }
}

export function receiveMatchedDrafts(drafts) {
  return {
    type: RECEIVE_MATCHED_DRAFTS_DATA,
    payload: {
      data: drafts,
      draftPage: 1,
      isFetching: false
    }
  }
}

export function receiveConferences(conferences) {
  return {
    type: RECEIVE_CONFERENCES_DATA,
    payload: {
      data: conferences,
      isFetching: false
    }
  }
}

export function receiveTracks(tracks) {
  return {
    type: RECEIVE_TRACKS_DATA,
    payload: {
      data: tracks,
      isFetching: false,
      isButtonDisabled: false
    }
  }
}

export function setAutosaveDraftId(id) {
  return {
    type: SET_AUTOSAVE_DRAFT_ID,
    payload: {
      id: id
    }
  }
}
export function fetchProtectedDataRequest() {
  return {
    type: FETCH_PROTECTED_DATA_REQUEST
  }
}


export function fetchUsersDataRequest() {
  return {
    type: FETCH_USERS_DATA_REQUEST,
    payload: {
      isFetching: true
    }
  }
}

export function fetchEventsDataRequest() {
  return {
    type: FETCH_EVENTS_DATA_REQUEST,
    payload: {
      isFetching: true
    }
  }
}

export function fetchDraftsDataRequest() {
  return {
    type: FETCH_DRAFTS_DATA_REQUEST,
    payload: {
      isFetching: true
    }
  }
}

export function fetchConferencesDataRequest() {
  return {
    type: FETCH_CONFERENCES_DATA_REQUEST,
    payload: {
      isFetching: true
    }
  }
}

export function fetchTracksDataRequest() {
  return {
    type: FETCH_TRACKS_DATA_REQUEST,
    payload: {
      isFetching: true,
      isButtonDisabled: true
    }
  }
}

export function fetchUsersData(token, upload=0) {
  return (dispatch, state) => {
    dispatch(fetchUsersDataRequest)
    return fetch(`${BASE_URI}/users`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(users => {
      dispatch(receiveUsers(users, upload));
      dispatch(receiveMatchedUsers(users));
    }) 
  }
}

export function fetchSpeakersData(token) {
  return (dispatch, state) => {
    dispatch(fetchUsersDataRequest)
    return fetch(`${BASE_URI}/users?speaker=true`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(users => {
      dispatch(receiveSpeakers(users));
    }) 
  }
}

export function postCreateEvent(token, confId, formData, showDraft='') {
  const data = formData
  return function (dispatch, state) {
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    }
    return fetch(`${BASE_URI}/event/create`, {
      method: 'POST',
      headers: {
        'Authorization': token
       },
      body: formData
      })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => { 
        let { success } = response;
        if(success) {
          dispatch(toggle(true))
          dispatch(flushEvent())
          if (showDraft) {
            dispatch(fetchDraftsData(token, confId));
          } else {
            dispatch(fetchEventsData(token, confId));
          }
        }
      })
      .catch(e => dispatch(requestFailure(e.message)))
  }
}

export function postEditEvent(eventId, token, confId, formData, showDraft='') {
  const data = formData
  return function (dispatch, state) {
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    } 
    return fetch(`${BASE_URI}/event/${eventId}/update`, {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: formData
      })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => { 
        let { success } = response;
        if(success) {
          dispatch(toggle(true))
          dispatch(flushEvent())
          if (showDraft) {
            dispatch(fetchDraftsData(token, confId));
          } else {
            dispatch(fetchEventsData(token, confId));
          }
        }
      })
      .catch(e => dispatch(requestFailure(e.message)))
  }
}

export function autosaveDraft(eventId, token, confId, formData, showDraft='') {
  const data = formData
  let url = `${BASE_URI}/event/create`
  if (eventId)
    url = `${BASE_URI}/event/${eventId}/update`
  return function (dispatch, state) {
    const formData = new FormData()
    for(var name in data) {
      formData.append(name, data[name]);
    } 
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: formData
      })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (!eventId) {
          let { success, id } = response;
          if(success) {
            dispatch(setAutosaveDraftId(id));
          }
        }
        if (showDraft)
          dispatch(fetchDraftsData(token, confId))
      })
      .catch(e => dispatch(requestFailure(e.message)))
  }
}

export function fetchEventsData(token, confId) {
  return (dispatch, state) => {
    const conferenceId = confId;
    dispatch(fetchEventsDataRequest)
    return fetch(`${BASE_URI}/conference/${conferenceId}/events`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(events => {
      dispatch(receiveEvents(events));
      dispatch(receiveMatchedEvents(events));
    }) 
  }
}

export function fetchDraftsData(token, confId) {
  return (dispatch, state) => {
    const conferenceId = confId;
    dispatch(fetchDraftsDataRequest)
    return fetch(`${BASE_URI}/conference/${conferenceId}/drafts`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(drafts => {
      dispatch(receiveDrafts(drafts));
      dispatch(receiveMatchedDrafts(drafts));
    }) 
  }
}

export function fetchConferencesData(token, confId) {
  return (dispatch, state) => {
    dispatch(fetchConferencesDataRequest)
    let conferenceId = confId;
    return fetch(`${BASE_URI}/conference/${conferenceId}`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(conferences => {
      dispatch(receiveConferences(conferences[0]));
    }) 
  }
}

export function fetchTracksData(token, confId, subtrack=0, parentId=0, trackName='') {
  return (dispatch, state) => {
    let conferenceId = confId;
    let url = ''
    if(parentId==0)
      url = `${BASE_URI}/conference/${conferenceId}/tracks`
    else
      url = `${BASE_URI}/conference/${conferenceId}/tracks?parentId=${parentId}`
    dispatch(fetchTracksDataRequest)
    return fetch(url, {
      headers: {
        'Authorization': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(checkSuccess)
    .then(fetchData)
    .then(tracks => {
      tracks = (subtrack == 0) ? tracks.filter(track => track.parentTrackId == 0 || track.parentTrackId == null) : tracks;
      dispatch(receiveTracks(tracks));
      if(subtrack==0) {
        dispatch(pushState(null, '/tracks'));
      }
      else if(subtrack==1)
        dispatch(pushState(null, `/subtracks?id=${parentId}&trackName=${trackName}`));
    }) 
  }
}

export function deleteTracksDataRequest(tracks) {
  return {
    type: DELETE_TRACKS_DATA_REQUEST,
    payload: {
      data: tracks,
      isFetching: false
    }
  }
}


export function deleteTrack(token, trackId, props, redirect="/tracks") {
  return (dispatch, state) => {
    let id = trackId;
    let newTracks = props.filter(tracks => tracks.id != id);
    return fetch(`${BASE_URI}/track/${id}/delete`, {
      method: 'delete',
      headers: {
        'Authorization': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      let {success, message} = response
      if (success)
        dispatch(deleteTracksDataRequest(newTracks))
      else
        dispatch(submitError(message))
    })
  }
}

export function createTrack(token, confId, trackTitle, startDate, endDate, subtrack=0, parentId=0, trackName='') {
  
  return function (dispatch, state) {
    let payload = {
      conferenceId: confId,
      trackTitle: trackTitle,
      startDate: startDate,
      endDate: endDate,
      parentId: parentId
    };
    return fetch(`${BASE_URI}/track/create`, {
      method: 'POST',
      headers: {
        'Authorization': `${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify(payload)
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response=> {
        let {success, message} = response
        if (success)
          dispatch(fetchTracksData(token, confId, subtrack, parentId, trackName))
        else
          dispatch(submitError(message))
      })
  };
}

export function fetchProtectedData(token) {
  return (dispatch, state) => {
    dispatch(fetchProtectedDataRequest());
    return fetch('http://localhost:3001/api/v1/users', {
      headers: {
        'Authorization': `${token}`
      }
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        let { success, responseObject } = response
        let { data } = responseObject
        dispatch(receiveProtectedData(data));
      })
      .catch(error => {
        if (error.response.status === 401) {
          dispatch(loginUserFailure(error));
          dispatch(pushState(null, '/login'));
        }
      })
  }
}
