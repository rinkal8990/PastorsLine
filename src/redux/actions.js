import { API_CALL, SET_CONTACTS, API_CALL_PAGINATION, SET_CONTACTS_PAGINATION } from './actionTypes';
import Axios from 'axios';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE3MSwiZXhwIjoxNjM5NDY2NjE1fQ.9vE-glLQtV2NT3gNMkqeRkrWWZAhYCqX-_ibs7lC8GY';
Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const getContacts = (params, pagination) => {
    return async (dispatch, getState) => {
        if (pagination) {
            let state = getState();
            dispatch({ type: API_CALL_PAGINATION, payload: true });
            let data = await APICall(params);
            data = {
                ...data,
                contacts: { ...state.Contacts.contacts, ...data.contacts },
                contacts_ids: [...state.Contacts.contacts_ids, ...data.contacts_ids],
            }
            dispatch({ type: SET_CONTACTS_PAGINATION, payload: { ...data, page: params.page } });
        } else {
            dispatch({ type: API_CALL, payload: true });
            let data = await APICall(params);
            dispatch({ type: SET_CONTACTS, payload: { ...data, page: 1 } });
        }
    }
}

export const clearContacts = () => {
    return async (dispatch) => {
        dispatch({ type: SET_CONTACTS, payload: null });
    }
}

const APICall = async (params) => {
    let response = await Axios.get('https://api.dev.pastorsline.com/api/contacts.json', {
        params: params
    });
    return response.data;
}