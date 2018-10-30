import { LOAD_PROJECTS } from '../actionTypes';

// DEPRECATED
const projects = (state = [], action) => {
    switch(action.type) {
        case LOAD_PROJECTS:
            return [...action.projects];
        default:
            return state;
    }
};

export default projects;