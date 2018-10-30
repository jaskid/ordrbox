import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_SUBJECT, REMOVE_SUBJECT } from '../actionTypes';

export const loadSubject = subject => ({
    type: LOAD_SUBJECT,
    subject
});

export const removeSubject = subject => ({
    type: REMOVE_SUBJECT
});

export const fetchSubject = ({ userid, projectid, groupid, orderid }) => {
    if(userid) {
        return dispatch => {
            return apiCall('get', `/api/hub/user/${userid}`)
                .then(res => {
                    // console.log('* user loaded! *');
                    res.isLoaded = true;
                    dispatch(loadSubject(res));
                })
                .catch(err => {
                    console.log('user load error!');
                    dispatch(addError(err.message));
                });
        };
    }
    else if(groupid && projectid) {
        return dispatch => {
            return apiCall('get', `/api/hub/group/${groupid}/project/${projectid}`)
                .then(res => {
                    // console.log('* project loaded! *');
                    res.isLoaded = true;
                    dispatch(loadSubject(res));
                })
                .catch(err => {
                    console.log('project load error!');
                    dispatch(addError(err.message));
                });
        };
    }
    else if(groupid && orderid) {
        return dispatch => {
            return apiCall('get', `/api/hub/group/${groupid}/order/${orderid}`)
                .then(res => {
                    // console.log('* order loaded! *');
                    res.isLoaded = true;
                    dispatch(loadSubject(res));
                })
                .catch(err => {
                    console.log('order load error!');
                    dispatch(addError(err.message));
                });
        };
    }
    else if(groupid) {
        return dispatch => {
            return apiCall('get', `/api/hub/group/${groupid}`)
                .then(res => {
                    // console.log('* group loaded! *');
                    res.isLoaded = true;
                    dispatch(loadSubject(res));
                })
                .catch(err => {
                    console.log('group load error!');
                    dispatch(addError(err.message));
                });
        };
    }
};
