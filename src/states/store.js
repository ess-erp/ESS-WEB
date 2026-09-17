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
import parentReducer from './ParentState/Reducer';
import teacherReducer from './TeacherState/Reducer';
import notificationReducer from './NotificationState/Reducer';
import accountingReducer from './AccountingState/Reducer';

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
  parent: parentReducer,
  teacher: teacherReducer,
  notification: notificationReducer,
  accounting: accountingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
