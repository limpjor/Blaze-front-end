import { combineReducers } from 'redux';
import managementReducers from  './management'

const rootReducer = combineReducers({
    management:managementReducers
});

export default rootReducer;