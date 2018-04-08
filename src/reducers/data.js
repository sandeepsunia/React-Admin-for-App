import {createReducer} from '../utils';
import {
    RECEIVE_PROTECTED_DATA,
    FETCH_PROTECTED_DATA_REQUEST,
    FETCH_USERS_DATA_REQUEST,
    RECEIVE_USERS_DATA,
    FETCH_CONFERENCES_DATA_REQUEST,
    RECEIVE_CONFERENCES_DATA,
    FETCH_TRACKS_DATA_REQUEST,
    RECEIVE_TRACKS_DATA,
    FETCH_EVENTS_DATA_REQUEST,
    RECEIVE_EVENTS_DATA,
    DELETE_TRACKS_DATA_REQUEST,
    DELETE_USER_FROM_STATE,
    CREATE_CONFERENCE_REQUEST,
    UPDATE_CONFERENCES_DATA,
    UPDATE_CONFERENCES_DATA_DONE,
    RECEIVE_MATCHED_EVENTS_DATA,
    FETCH_DRAFTS_DATA_REQUEST,
    RECEIVE_DRAFTS_DATA,
    RECEIVE_MATCHED_DRAFTS_DATA,
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

const initialState = {
    data: [],
    events: [],
    matchedEvents: [],
    matchedUsers: [],
    drafts: [],
    matchedDrafts: [],
    conferences: {},
    tracks: [],
    users: [],
    speakers:[],
    isFetching: true,
    idUpdating: true,
    statusMessage: '',
    submitError: '',
    uploadMessage: '',
    draftPage: '',
    //autosaveDraftId: '',
    currentEvent: {
        event: {
            title: "",
            image: "",
            trackId: "",
            status: "",
            scheduleId: "",
            metadata: {}
        },
        members: {},
        schedule: {}
    }
};

export default createReducer(initialState, {
    // [RECEIVE_PROTECTED_DATA]: (state, payload) => {
    //     return {
    //         ...state,
    //         data: payload.data,
    //         isFetching: false
    //     }
    // },
    // [FETCH_PROTECTED_DATA_REQUEST]: (state, payload) => {
    //     return {
    //         ...state,
    //         'isFetching': true
    //     }
    // },
    [RECEIVE_USERS_DATA]: (state, payload) => {
        return {
            ...state,
            users: payload.data,
            isFetching: payload.isFetching,
            uploadMessage: payload.uploadMessage
        }
    },
    [RECEIVE_SPEAKERS_DATA]: (state, payload) => {
        return {
            ...state,
            speakers: payload.data
        }
    },
    [RECEIVE_MATCHED_USERS_DATA]: (state, payload) => {
        return {
            ...state,
            matchedUsers: payload.data
        }
    },
    [FETCH_USERS_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            isFetching: payload.isFetching
        }
    },
    [RECEIVE_CONFERENCES_DATA]: (state, payload) => {
        return {
            ...state,
            conferences: payload.data,
            isFetching: payload.isFetching
        }
    },
    [FETCH_CONFERENCES_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            isFetching: payload.isFetching
        }
    },
    [RECEIVE_TRACKS_DATA]: (state, payload) => {
        return {
            ...state,
            tracks: payload.data,
            isFetching: payload.isFetching,
            isButtonDisabled: payload.isButtonDisabled
        }
    },
    [DELETE_TRACKS_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            tracks: payload.data,
            isFetching: payload.isFetching
        }
    },
    [FETCH_TRACKS_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            isFetching: payload.isFetching,
            isButtonDisabled: payload.isButtonDisabled
        }
    },
    [RECEIVE_EVENTS_DATA]: (state, payload) => {
        return {
            ...state,
            events: payload.data,
            isFetching: payload.isFetching
        }
    },
    [FETCH_EVENTS_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            'isFetching': payload.isFetching
        }
    },
    [RECEIVE_DRAFTS_DATA]: (state, payload) => {
        return {
            ...state,
            drafts: payload.data,
            isFetching: payload.isFetching
        }
    },
    [FETCH_DRAFTS_DATA_REQUEST]: (state, payload) => {
        return {
            ...state,
            'isFetching': payload.isFetching
        }
    },
    [CREATE_CONFERENCE_REQUEST]: (state, payload) => {
        return {
            ...state,
            conferences: {}
        }
    },
    [UPDATE_CONFERENCES_DATA]: (state, payload) => {
        return {
            ...state,
            isUpdating: payload.isUpdating
        }
    },
    [UPDATE_CONFERENCES_DATA_DONE]: (state, payload) => {
        return {
            ...state,
            isUpdating: payload.isUpdating,
            statusMessage: 'Conference updated successfully.',
            conferences: payload.data
        }
    },
    [SUBMIT_ERROR]: (state, payload) => {
        return {
            ...state,
            submitError: payload.error
        }
    },
    [RECEIVE_MATCHED_EVENTS_DATA]: (state, payload) => {
        return {
            ...state,
            matchedEvents: payload.data,
            draftPage: payload.draftPage,
            isFetching: payload.isFetching
        }
    },
    [RECEIVE_MATCHED_DRAFTS_DATA]: (state, payload) => {
        return {
            ...state,
            matchedDrafts: payload.data,
            draftPage: payload.draftPage,
            isFetching: payload.isFetching
        }
    },
    [DELETE_USER_FROM_STATE]: (state, payload) => {
        let { users } = state;
        let updatedUsers = users.filter(user => user.id != payload.userId);
        return {
            ...state,
            users: updatedUsers,
            matchedUsers: updatedUsers,
            isFetching: payload.isFetching
        }
    },
    [SET_AUTOSAVE_DRAFT_ID]: (state, payload) => {
        return {
            ...state,
            autosaveDraftId: payload.id
        }
    },
    [TOGGLE_MODAL]: (state, payload) => {
        return {
            ...state,
            toggle: payload.toggle
            //autosaveDraftId: payload.autosaveDraftId
        }
    },
    [EDIT_USER_MODAL]: (state, payload) => {
        return {
            ...state,
            token: payload.token,
            editMode: payload.editMode,
            currentUser: payload.currentUser
        }
    },
    [EDIT_EVENT_MODAL]: (state, payload) => {
        return {
            ...state,
            token: payload.token,
            editMode: payload.editMode,
            currentEvent: payload.currentEvent
        }
    },
    [SET_EDIT_MODE]: (state, payload) => {
        return {
            ...state,
            editMode: payload.editMode,
            trackId: payload.trackId
        }
    },
    [FLUSH_CURRENT_USER]: (state, payload) => {
        return {
            ...state,
            currentUser: {}
        }
    },
    [FLUSH_CURRENT_EVENT]: (state, payload) => {
        return {
            ...state,
          currentEvent: {
              event: {
                title: "",
                image: "",
                trackId: "",
                status: "",
                scheduleId: "",
                metadata: {}
              },
              members: {},
              schedule: {}
          }
        }
    }
    
});
