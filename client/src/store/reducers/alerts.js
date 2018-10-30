import {ADD_ALERT, REMOVE_ALERT} from '../actionTypes';
// TODO: add uuid functionality:
// import uuid from 'uuid';

const alerts = (state = [], action) => {
    switch(action.type) {
        case ADD_ALERT:
            return [ ...state, 
                        {
                            text: action.text,
                            event: action.event,
                            author: action.author,
                            timestamp: action.timestamp,
                            // id: uuid()
                        }
                    ];
        case REMOVE_ALERT:
            return state.filter((alert) => {
                if ( alert.id === action.id ) {
                  return false;
                } else {
                  return true;
                }
            });
        default:
            return state;
    }
};

export default alerts;