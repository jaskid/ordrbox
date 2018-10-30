import { LOAD_ORDER, REMOVE_ORDER } from '../actionTypes';

const order = (state = {isLoaded: false}, action) => {
    switch(action.type) {
        case LOAD_ORDER:
            return action.order;
        case REMOVE_ORDER:
            return { isLoaded: false };
        default:
            return state;
    }
};

export default order;