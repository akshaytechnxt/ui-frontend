import { combineReducers } from 'redux';
import configureStore from '../CreateStore'
export default () => {
    const rootReducer = combineReducers({
    });

    return configureStore(rootReducer)
}

// export default rootReducer;