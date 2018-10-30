import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_USER_GROUPS } from '../actionTypes';

export const loadUserGroups = userGroups => ({
    type: LOAD_USER_GROUPS,
    userGroups
});

// fetches the data for the current user
export const fetchUserGroups = (userid) => {
    // console.log('fetching user DATA');
    return dispatch => {
        return apiCall('get', `/api/hub/user/${userid}/groups`)
            .then(res => {
                // console.log('user groups loaded!');
                dispatch(loadUserGroups(res));
            })
            .catch((err) => {
                console.log('user groups error!');
                if(err) {
                    dispatch(addError(err.message));
                    console.log(err.message);
                } else {
                    console.log('userGroups: no error found?');
                }
            });
    };
};