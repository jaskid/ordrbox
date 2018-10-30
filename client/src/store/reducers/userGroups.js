import { LOAD_USER_GROUPS } from '../actionTypes';

const userGroups = (state=[], action) => {
    switch(action.type) {
        case LOAD_USER_GROUPS:
            return [...action.userGroups];
        default:
            return state;
    }
};

export default userGroups;