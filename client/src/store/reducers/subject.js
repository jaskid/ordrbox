import { LOAD_SUBJECT, REMOVE_SUBJECT } from '../actionTypes';

const subject = (state = {isLoaded: false}, action) => {
    switch(action.type) {
        case LOAD_SUBJECT:
            return action.subject;
        case REMOVE_SUBJECT:
            return { isLoaded: false };
        default:
            return state;
    }
};

export default subject;