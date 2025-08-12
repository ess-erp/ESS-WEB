import {
    FETCH_CAMPUS_REQUEST, FETCH_CAMPUS_SUCCESS, FETCH_CAMPUS_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_STRAND_REQUEST, FETCH_STRAND_SUCCESS, FETCH_STRAND_FAILURE,
    FETCH_NATIONALITY_REQUEST, FETCH_NATIONALITY_SUCCESS, FETCH_NATIONALITY_FAILURE,
    FETCH_RELIGION_REQUEST, FETCH_RELIGION_SUCCESS, FETCH_RELIGION_FAILURE,
    FETCH_OTPCODE_REQUEST, FETCH_OTPCODE_SUCCESS, FETCH_OTPCODE_FAILURE,
} from './ActionType';

const initialFormState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialState = {
    campusState: { ...initialFormState },
    divisionState: { ...initialFormState },
    levelState: { ...initialFormState },
    strandState: { ...initialFormState },
    nationalityState: { ...initialFormState },
    religionState: { ...initialFormState },
    otpcodeState: { ...initialFormState },
}

const onlineAppReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CAMPUS_REQUEST:
            return { ...state, campusState: { loading: true, data: [], error: '' } };
        case FETCH_CAMPUS_SUCCESS:
            return { ...state, campusState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CAMPUS_FAILURE:
            return { ...state, campusState: { loading: false, data: [], error: action.payload, success: false } }

        // Division
        case FETCH_DIVISION_REQUEST:
            return { ...state, divisionState: { loading: true, data: [], error: '' } };
        case FETCH_DIVISION_SUCCESS:
            return { ...state, divisionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DIVISION_FAILURE:
            return { ...state, divisionState: { loading: false, data: [], error: action.payload } };
        // Level
        case FETCH_LEVEL_REQUEST:
            return { ...state, levelState: { loading: true, data: [], error: '' } };
        case FETCH_LEVEL_SUCCESS:
            return { ...state, levelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LEVEL_FAILURE:
            return { ...state, levelState: { loading: false, data: [], error: action.payload } };

        //Strand
        case FETCH_STRAND_REQUEST:
            return { ...state, strandState: { loading: true, data: [], error: '' } };
        case FETCH_STRAND_SUCCESS:
            return { ...state, strandState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STRAND_FAILURE:
            return { ...state, strandState: { loading: false, data: [], error: action.payload } };

        //Nationality
        case FETCH_NATIONALITY_REQUEST:
            return { ...state, nationalityState: { loading: true, data: [], error: '' } };
        case FETCH_NATIONALITY_SUCCESS:
            return { ...state, nationalityState: { loading: false, data: action.payload, error: '' } };
        case FETCH_NATIONALITY_FAILURE:
            return { ...state, nationalityState: { loading: false, data: [], error: action.payload } };

        //Religion
        case FETCH_RELIGION_REQUEST:
            return { ...state, religionState: { loading: true, data: [], error: '' } };
        case FETCH_RELIGION_SUCCESS:
            return { ...state, religionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_RELIGION_FAILURE:
            return { ...state, religionState: { loading: false, data: [], error: action.payload } };
            
        //OTP Code
        case FETCH_OTPCODE_REQUEST:
            return { ...state, otpcodeState: { loading: true, data: [], error: '' } };
        case FETCH_OTPCODE_SUCCESS:
            return { ...state, otpcodeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_OTPCODE_FAILURE:
            return { ...state, otpcodeState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}

export default onlineAppReducer;