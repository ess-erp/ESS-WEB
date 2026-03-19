import {
    FETCH_RETURNEE_OLD_STUDENT_REQUEST, FETCH_RETURNEE_OLD_STUDENT_SUCESS, FETCH_RETURNEE_OLD_STUDENT_FAILURE
} from './ActionType';
import { getToken } from '../../services/tokenServices';
import InputField from '../../components/ButtonsComponents/InputField';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchReturneeOldStudentRequest = () => ({ type: FETCH_RETURNEE_OLD_STUDENT_REQUEST });
export const fetchReturneeOldStudentSuccess = (data) => ({ type: FETCH_RETURNEE_OLD_STUDENT_SUCESS, payload: data});  
export const fetchReturneeOldStudentFailure = (error) => ({ type: FETCH_RETURNEE_OLD_STUDENT_FAILURE, payload: error});

export const fetchReturneeOldStudentData = (userId, status) => async (dispatch) => {
    dispatch(fetchReturneeOldStudentRequest());
    try {
        const token = getToken();
        const url = `${baseUrl}/parent/returnee-old-student?userId=${userId}&status=${status}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();

        dispatch(fetchReturneeOldStudentSuccess(res));
        return ({ ok: true, data: res.data});
    }
    catch(error){
        dispatch(fetchReturneeOldStudentFailure(error.message));
        return({ ok: false, error})
    }
};


