import {ADD_ALERT, REMOVE_ALERT} from '../actionTypes';

export const _addAlert = ({text, event}) => ({
    type: ADD_ALERT,
    text,
    event
});

export const _removeAlert = id => ({
    type: REMOVE_ALERT,
    id
});

export const addAlert = alert => {
    console.log('adding alert!');
    return dispatch => {
        dispatch(_addAlert(alert));
    };
};

export const removeAlert = id => {
    console.log('removing alert!');
    return dispatch => {
        dispatch(_removeAlert(id));
    };
};

// export const deleteAlert = id => {
    // return dispatch => {
    //     return new Promise((resolve, reject) => {
    //         return apiCall('get', `/api/hub/group/${groupid}/order/${orderid}`)
    //             .then(res => {
    //                 res.isLoaded = true;
    //                 dispatch(loadOrder(res));
    //             })
    //             .catch(err => {
    //                 console.log('Error: 404 Order not found.');
    //                 dispatch(addError(err.message));
    //             });
    //     });
    // };
// }