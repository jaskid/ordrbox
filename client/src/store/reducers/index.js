import {combineReducers} from 'redux';

// REDUCERS
import currentUser from './currentUser';
import userGroups from './userGroups';
import alerts from './alerts';
import orders from './orders';
import order from './order';
import subject from './subject';
import errors from './errors';

const rootReducer = combineReducers({
    currentUser,
    userGroups,
    alerts,
    orders,
    order,
    subject,
    errors
});

export default rootReducer;