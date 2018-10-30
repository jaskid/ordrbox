import axios from 'axios';
// TODO: config socket for IM/Alert system
// import io from 'socket.io-client';

export function setTokenHeader(token) {
    if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // SOCKET CONFIG
        // console.log('Connecting socket!');
        // var socket = io.connect(':8081', {
        //     query: {token: token}
        // });
        // socket.on('change color', (col) => {
        //     console.log('RECEIVED COLOR CHANGE:');
        //     console.log(col);
        // });
    } else {
        delete axios.defaults.headers.common['Authorization'];
        // SOCKET CONFIG
        // if(socket) {
        //     console.log('Disconnecting socket.');
        //     socket.disconnect();
        // }
    }
}

/**
 * A wrapper around axios API call that formats errors, etc.
 * @param {string} method - the HTTP verb you want to use
 * @param {string} path - the route path / endpoint
 * @param {object} data - (optional) data in JSON form for POST requests
 */
export function apiCall(method, path, data) {
    return new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then(res => {
                return resolve(res.data);
            })
            .catch(err => {
                if(err.response.data.error) {
                    return reject(err.response.data.error);
                } else {
                    return reject(err);
                }
            });
    });
}