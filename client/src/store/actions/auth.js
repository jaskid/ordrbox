/* global localStorage */
import { SET_CURRENT_USER } from '../actionTypes';
import { apiCall, setTokenHeader } from '../../services/api';
import { addError, removeError } from './errors';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function setAuthorizationToken(token) {
    setTokenHeader(token);
}

export function logout() {
    return dispatch => {
        localStorage.clear();
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    };
}

export function authUser(type, userData) {
    return dispatch => {
        // wrap our thunk in a promise so we can wait for the API call
        return new Promise((resolve, reject) => {
            return apiCall('post', `/api/auth/${type}`, userData)
                .then(({ token, ...user }) => {
                    localStorage.setItem('jwtToken', token);
                    setAuthorizationToken(token);
                    dispatch(setCurrentUser(user));
                    dispatch(removeError());
                    // API call succeeded
                    resolve(user);
                })
                .catch(error => {
                    dispatch(addError(error.message));
                    // API call failed
                    reject();
                });
        });
    };
}

export function authConfirm(token) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('get', `/api/auth/confirm/${token}`)
                .then(({ token, ...user }) => {
                    localStorage.setItem('jwtToken', token);
                    setAuthorizationToken(token);
                    dispatch(setCurrentUser(user));
                    dispatch(removeError());
                    // API call succeeded
                    resolve(user);
                })
                .catch(error => {
                    dispatch(addError(error.message));
                    // API call failed
                    reject();
                });
        });
    };
}

export function joinGroup(groupData) {
    return new Promise((resolve, reject) => {
        return apiCall('post', '/api/auth/join', groupData)
            .then(res => {
                console.log(res);
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

// TODO: move these to separate action group (join should stay)
export function createGroup(groupData) {
    return new Promise((resolve, reject) => {
        return apiCall('post', '/api/hub/group', groupData)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error.message);
            });
    });
}

export function editGroup(groupid, groupData) {
    return new Promise((resolve, reject) => {
        return apiCall('post', `/api/hub/group/${groupid}`, groupData)
            .then(res => {
                console.log(res);
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function deleteGroup(groupid) {
    return new Promise((resolve, reject) => {
        return apiCall('delete', `/api/hub/group/${groupid}`)
            .then(res => {
                console.log(res);
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}