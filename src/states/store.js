import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  
import loginformReducer from './AuthState/Reducer';
import onlineAppReducer from './OnlineApplicationState/Reducer';
import admissionReducer from './AdmissionState/Reducer';
import cfwReducer from './CfwState/Reducer';
import cashierReducer from './CashierState/Reducer';
import financeReducer from './FinanceState/Reducer';
import studentRecordReducer from './SruState/Reducer';
import hrReducer from './HumanResourcesState/Reducer';
import academicReducer from './AcademicState/Reducer';
import sacReducer from './SacState/Reducer';
import apReducer from './AssistantPrincipalState/Reducer';
import principalReducer from './PrincipalState/Reducer';

const rootReducer = combineReducers({
  login: loginformReducer,
  online: onlineAppReducer,
  admission: admissionReducer,
  cfw: cfwReducer,
  cashier: cashierReducer,
  finance: financeReducer,
  sru: studentRecordReducer,
  hr: hrReducer,
  academic: academicReducer,
  sac: sacReducer,
  ap: apReducer,
  principal: principalReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
