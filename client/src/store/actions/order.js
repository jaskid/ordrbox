import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_ORDERS, LOAD_ORDER, REMOVE_ORDERS, REMOVE_ORDER } from '../actionTypes';

export const loadOrders = orders => ({
    type: LOAD_ORDERS,
    orders
});

export const loadOrder = order => ({
    type: LOAD_ORDER,
    order
});

export const removeOrder = order => ({
    type: REMOVE_ORDER
});

export const removeOrders = orders => ({
    type: REMOVE_ORDERS
});

export function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        return apiCall('post', `/api/hub/group/${orderData.group}/order`, orderData)
            .then(res => {
                console.log('ORDER SUCCESSFULLY CREATED');
                console.log(res);
                resolve(res);
            })
            .catch(error => {
                console.log('ORDER FAILED');
                console.log(error);
                reject(error);
            });
    });
}

export const queryOrders = (query, { groupid, userid, projectid }) => {
    // console.log('QUERY RECEIVED:');
    // console.log(query);
    if(userid) {
        return dispatch => {
            return apiCall('post', `/api/hub/user/${userid}/orders`, query)
                .then(res => {
                    // console.log(" * USER'S ORDERS LOADED * ");
                    dispatch(loadOrders(res));
                })
                .catch(err => {
                    console.log(" * ERROR: USER'S ORDERS FAILED TO LOAD * ");
                    dispatch(addError(err.message));
                });
        };
    }
    else if(groupid && projectid) {
        return dispatch => {
            return apiCall('post', `/api/hub/group/${groupid}/project/${projectid}/orders`, query)
                .then(res => {
                    // console.log(" * PROJECT'S ORDERS LOADED * ");
                    dispatch(loadOrders(res));
                })
                .catch(err => {
                    console.log(" * ERROR: PROJECT'S ORDERS FAILED TO LOAD * ");
                    dispatch(addError(err.message));
                });
        };
    }
    else if(groupid) {
        return dispatch => {
            return apiCall('post', `/api/hub/group/${groupid}/orders`, query)
                .then(res => {
                    // console.log(" * GROUP'S ORDERS LOADED * ");
                    dispatch(loadOrders(res));
                })
                .catch(err => {
                    console.log(" * ERROR: GROUP'S ORDERS FAILED TO LOAD * ");
                    dispatch(addError(err.message));
                });
        };
    }
};

export function stampOrder({orderid, groupid, stampid}) {
    return new Promise((resolve, reject) => {
        return apiCall('post', `/api/hub/group/${groupid}/order/${orderid}`, {stampid: stampid, orderid: orderid})
            .then(res => {
                console.log('ORDER STAMPED');
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function holdOrder({orderid, groupid, hold}) {
    return new Promise((resolve, reject) => {
        return apiCall('post', `/api/hub/group/${groupid}/order/${orderid}/hold`, {hold: hold, orderid: orderid})
            .then(res => {
                console.log('ORDER PUT ON HOLD');
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function cancelOrder({orderid, groupid, canceled}) {
    return new Promise((resolve, reject) => {
        return apiCall('post', `/api/hub/group/${groupid}/order/${orderid}`, {canceled: canceled, orderid: orderid})
            .then(res => {
                console.log('ORDER CANCELED');
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function deleteOrder({orderid, groupid}) {
    return new Promise((resolve, reject) => {
        return apiCall('delete', `/api/hub/group/${groupid}/order/${orderid}`)
            .then(res => {
                console.log('ORDER PUT ON HOLD');
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
}


export function fetchOrder(groupid, orderid) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('get', `/api/hub/group/${groupid}/order/${orderid}`)
                .then(res => {
                    res.isLoaded = true;
                    dispatch(loadOrder(res));
                })
                .catch(err => {
                    console.log('Error: 404 Order not found.');
                    dispatch(addError(err.message));
                });
        });
    };
}