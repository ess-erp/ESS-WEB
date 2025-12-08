import {
    FETCH_LOGIN_REQUEST, FETCH_LOGIN_SUCCESS, FETCH_LOGIN_FAILURE,
    FETCH_GOOGLELOGIN_REQUEST, FETCH_GOOGLELOGIN_SUCCESS, FETCH_GOOGLELOGIN_FAILURE,
} from './ActionType';


const initialFormState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialState = {
    loginForm: { ...initialFormState },
    googleLoginForm: { ...initialFormState },
}

const loginformReducer = (state = initialState, action) => {
    switch (action.type) {
        //login
        case FETCH_LOGIN_REQUEST:
            return { ...state, loginForm: { loading: true, data: [], error: '' } };
        case FETCH_LOGIN_SUCCESS:
            return { ...state, loginForm: { loading: false, data: action.payload, error: '' } };
        case FETCH_LOGIN_FAILURE:
            return { ...state, loginForm: { loading: false, data: [], error: action.payload, success: false } };

        case FETCH_GOOGLELOGIN_REQUEST:
            return { ...state, googleLoginForm: { loading: true, data: [], error: '' } };
        case FETCH_GOOGLELOGIN_SUCCESS:
            return { ...state, googleLoginForm: { loading: false, data: action.payload, error: '' } };
        case FETCH_GOOGLELOGIN_FAILURE:
            return { ...state, googleLoginForm: { loading: false, data: [], error: action.payload, success: false } };

        default:
            return state;
    }
};

export default loginformReducer;