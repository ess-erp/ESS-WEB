import {
    FETCH_LOGIN_REQUEST, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAILURE,
} from './ActionType';
import { setToken } from '../../services/tokenServices';
// import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_BASE_URL;

//Login
export const fetchLoginRequest = () => ({ type: FETCH_LOGIN_REQUEST });
export const fetchLoginSuccess = (data) => ({ type: FETCH_LOGIN_SUCCESS, payload: data });
export const fetchLoginFailure = (error) => ({type: FETCH_LOGIN_FAILURE, payload: error });

export const fetchLoginData = (formData) => async(dispatch) => {
    dispatch(fetchLoginRequest());
    try{
        // const navigate = useNavigate();
        const url = `${baseUrl}/auth/login`;

        const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        });
       
        const res = await response.json();
        if(res.success == false){
            throw new Error(res.message);
        }
        dispatch(fetchLoginSuccess(res));
        setToken(res.Token);
        localStorage.setItem('userData', JSON.stringify(res));
        return{ok: true, role: res.UserRole };
    }
    catch(error){
        dispatch(fetchLoginFailure(error.message));
        return { ok: false, error};
    }
};