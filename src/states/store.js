import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  
import loginformReducer from './AuthState/Reducer';
import onlineAppReducer from './OnlineApplicationState/Reducer';
import admissionReducer from './AdmissionState/Reducer';

const rootReducer = combineReducers({
  login: loginformReducer,
  online: onlineAppReducer,
  admission: admissionReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
