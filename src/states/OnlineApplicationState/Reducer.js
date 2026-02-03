import {
    FETCH_CAMPUS_REQUEST, FETCH_CAMPUS_SUCCESS, FETCH_CAMPUS_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_STRAND_REQUEST, FETCH_STRAND_SUCCESS, FETCH_STRAND_FAILURE,
    FETCH_NATIONALITY_REQUEST, FETCH_NATIONALITY_SUCCESS, FETCH_NATIONALITY_FAILURE,
    FETCH_RELIGION_REQUEST, FETCH_RELIGION_SUCCESS, FETCH_RELIGION_FAILURE,
    FETCH_OTPCODE_REQUEST, FETCH_OTPCODE_SUCCESS, FETCH_OTPCODE_FAILURE,
    FETCH_PROVINCE_REQUEST, FETCH_PROVINCE_SUCCESS, FETCH_PROVINCE_FAILURE,
    FETCH_CITY_REQUEST, FETCH_CITY_SUCCESS, FETCH_CITY_FAILURE,
    FETCH_BARANGAY_REQUEST, FETCH_BARANGAY_SUCCESS, FETCH_BARANGAY_FAILURE,
    FETCH_INSERTSTUDENT_REQUEST, FETCH_INSERTSTUDENT_SUCCESS, FETCH_INSERTSTUDENT_FAILURE,
    FETCH_OLDSTUDENT_REQUEST, FETCH_OLDSTUDENT_SUCCESS, FETCH_OLDSTUDENT_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_INSERT_EMPLOYEE_REQUEST, FETCH_INSERT_EMPLOYEE_SUCCESS, FETCH_INSERT_EMPLOYEE_FAILURE,
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
    provinceState: { ...initialFormState },
    cityState: { ...initialFormState },
    barangayState: { ...initialFormState },
    insertStudentState: { ...initialFormState },
    oldStudentState: { ...initialFormState },
    studentDataState: { ...initialFormState },
    insertEmployeeState: { ...initialFormState },
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

        //Province
        case FETCH_PROVINCE_REQUEST:
            return { ...state, provinceState: { loading: true, data: [], error: '' } };
        case FETCH_PROVINCE_SUCCESS:
            return { ...state, provinceState: { loading: false, data: action.payload, error: '' } };
        case FETCH_PROVINCE_FAILURE:
            return { ...state, provinceState: { loading: false, data: '', error: action.payload } };

        //City
        case FETCH_CITY_REQUEST:
            return { ...state, cityState: { loading: true, data: [], error: '' } };
        case FETCH_CITY_SUCCESS:
            return { ...state, cityState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CITY_FAILURE:
            return { ...state, cityState: { loading: false, data: '', error: action.payload } };

        //Barangay
        case FETCH_BARANGAY_REQUEST:
            return { ...state, barangayState: { loading: true, data: [], error: '' } };
        case FETCH_BARANGAY_SUCCESS:
            return { ...state, barangayState: { loading: false, data: action.payload, error: '' } };
        case FETCH_BARANGAY_FAILURE:
            return { ...state, barangayState: { loading: false, data: '', error: action.payload } };

        //Insert New Student
        case FETCH_INSERTSTUDENT_REQUEST:
            return { ...state, insertStudentState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTSTUDENT_SUCCESS:
            return { ...state, insertStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTSTUDENT_FAILURE:
            return { ...state, insertStudentState: { loading: false, data: '', error: action.payload } };

        //Fetch Old Student
        case FETCH_OLDSTUDENT_REQUEST:
            return { ...state, oldStudentState: { loading: true, data: [], error: '' } };
        case FETCH_OLDSTUDENT_SUCCESS:
            return { ...state, oldStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_OLDSTUDENT_FAILURE:
            return { ...state, oldStudentState: { loading: false, data: '', error: action.payload } };

        //Fetch Student Data using StudentId
        case FETCH_STUDENTBYID_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTBYID_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTBYID_FAILURE:
            return { ...state, studentDataState: { loading: false, data: '', error: action.payload } };

        //Insert New Employee
        case FETCH_INSERT_EMPLOYEE_REQUEST:
            return { ...state, insertEmployeeState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_EMPLOYEE_SUCCESS:
            return { ...state, insertEmployeeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_EMPLOYEE_FAILURE:
            return { ...state, insertEmployeeState: { loading: false, data: '', error: action.payload } };

        default:
            return state;
    }
}

export default onlineAppReducer;