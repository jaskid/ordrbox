import { LOAD_ORDERS, REMOVE_ORDERS } from '../actionTypes';

const orders = (state = [], action) => {
    switch(action.type) {
        case LOAD_ORDERS:
            return [...action.orders];
        case REMOVE_ORDERS:
            return [];
        default:
            return state;
    }
};

export default orders;