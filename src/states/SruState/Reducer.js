import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENT_INFO_REQUEST, FETCH_STUDENT_INFO_SUCCESS, FETCH_STUDENT_INFO_FAILURE,
    FETCH_UPDATE_STUDENT_INFO_REQUEST, FETCH_UPDATE_STUDENT_INFO_SUCCESS, FETCH_UPDATE_STUDENT_INFO_FAILURE,
    FETCH_INSERT_SECTION_NAME_REQUEST, FETCH_INSERT_SECTION_NAME_SUCCESS, FETCH_INSERT_SECTION_NAME_FAILURE,
    FETCH_GET_SECTION_NAME_REQUEST, FETCH_GET_SECTION_NAME_SUCCESS, FETCH_GET_SECTION_NAME_FAILURE,
    FETCH_GET_ENROLLED_STUDENT_REQUEST, FETCH_GET_ENROLLED_STUDENT_SUCCESS, FETCH_GET_ENROLLED_STUDENT_FAILURE,
    FETCH_INSERT_STUDENT_SECTION_REQUEST, FETCH_INSERT_STUDENT_SECTION_SUCCESS, FETCH_INSERT_STUDENT_SECTION_FAILURE,
    FETCH_GET_STUDENT_SECTION_LIST_REQUEST, FETCH_GET_STUDENT_SECTION_LIST_SUCCESS, FETCH_GET_STUDENT_SECTION_LIST_FAILURE,
    FETCH_INSERT_HOUSE_NAME_REQUEST, FETCH_INSERT_HOUSE_NAME_SUCCESS, FETCH_INSERT_HOUSE_NAME_FAILURE,
    FETCH_GET_HOUSE_NAME_REQUEST, FETCH_GET_HOUSE_NAME_SUCCESS, FETCH_GET_HOUSE_NAME_FAILURE,
    FETCH_GET_HOUSE_STUDENT_REQUEST, FETCH_GET_HOUSE_STUDENT_SUCCESS, FETCH_GET_HOUSE_STUDENT_FAILURE,
    FETCH_INSERT_STUDENT_HOUSE_REQUEST, FETCH_INSERT_STUDENT_HOUSE_SUCCESS, FETCH_INSERT_STUDENT_HOUSE_FAILURE,
    FETCH_GET_STUDENT_HOUSE_LIST_REQUEST, FETCH_GET_STUDENT_HOUSE_LIST_SUCCESS, FETCH_GET_STUDENT_HOUSE_LIST_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialGeneralState = {
    tableState: { ...initialState },
    studentDataState: { ...initialState },
    updateStudentDataState: { ...initialState },
    insertSectionName: { ...initialState },
    sectionTableState: { ...initialState },
    enrolledStudentState: { ...initialState },
    insertStudentSection: { ...initialState },
    studentSectionListState: { ...initialState },
    insertHouseName: { ...initialState },
    houseTableState: { ...initialState },
    houseStudentState: { ...initialState },
    insertStudentHouse: { ...initialState },
    studentHouseListState: { ...initialState },
};
const sruReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        //Get Enrollment table
        case FETCH_ENROLLMENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        case FETCH_STUDENT_INFO_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_INFO_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_INFO_FAILURE:
            return { ...state, studentDataState: { loading: false, data: [], error: action.payload } };

        case FETCH_UPDATE_STUDENT_INFO_REQUEST:
            return { ...state, updateStudentDataState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_STUDENT_INFO_SUCCESS:
            return { ...state, updateStudentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_STUDENT_INFO_FAILURE:
            return { ...state, updateStudentDataState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_SECTION_NAME_REQUEST:
            return { ...state, insertSectionName: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_SECTION_NAME_SUCCESS:
            return { ...state, insertSectionName: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_SECTION_NAME_FAILURE:
            return { ...state, insertSectionName: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_SECTION_NAME_REQUEST:
            return { ...state, sectionTableState: { loading: true, data: [], error: '' } };
        case FETCH_GET_SECTION_NAME_SUCCESS:
            return { ...state, sectionTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_SECTION_NAME_FAILURE:
            return { ...state, sectionTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_ENROLLED_STUDENT_REQUEST:
            return { ...state, enrolledStudentState: { loading: true, data: [], error: '' } };
        case FETCH_GET_ENROLLED_STUDENT_SUCCESS:
            return { ...state, enrolledStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_ENROLLED_STUDENT_FAILURE:
            return { ...state, enrolledStudentState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_STUDENT_SECTION_REQUEST:
            return { ...state, insertStudentSection: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_STUDENT_SECTION_SUCCESS:
            return { ...state, insertStudentSection: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_STUDENT_SECTION_FAILURE:
            return { ...state, insertStudentSection: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_STUDENT_SECTION_LIST_REQUEST:
            return { ...state, studentSectionListState: { loading: true, data: [], error: '' } };
        case FETCH_GET_STUDENT_SECTION_LIST_SUCCESS:
            return { ...state, studentSectionListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_STUDENT_SECTION_LIST_FAILURE:
            return { ...state, studentSectionListState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_HOUSE_NAME_REQUEST:
            return { ...state, insertHouseName: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_HOUSE_NAME_SUCCESS:
            return { ...state, insertHouseName: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_HOUSE_NAME_FAILURE:
            return { ...state, insertHouseName: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_HOUSE_NAME_REQUEST:
            return { ...state, houseTableState: { loading: true, data: [], error: '' } };
        case FETCH_GET_HOUSE_NAME_SUCCESS:
            return { ...state, houseTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_HOUSE_NAME_FAILURE:
            return { ...state, houseTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_HOUSE_STUDENT_REQUEST:
            return { ...state, houseStudentState: { loading: true, data: [], error: '' } };
        case FETCH_GET_HOUSE_STUDENT_SUCCESS:
            return { ...state, houseStudentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_HOUSE_STUDENT_FAILURE:
            return { ...state, houseStudentState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_STUDENT_HOUSE_REQUEST:
            return { ...state, insertStudentHouse: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_STUDENT_HOUSE_SUCCESS:
            return { ...state, insertStudentHouse: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_STUDENT_HOUSE_FAILURE:
            return { ...state, insertStudentHouse: { loading: false, data: [], error: action.payload } };

        case FETCH_GET_STUDENT_HOUSE_LIST_REQUEST:
            return { ...state, studentHouseListState: { loading: true, data: [], error: '' } };
        case FETCH_GET_STUDENT_HOUSE_LIST_SUCCESS:
            return { ...state, studentHouseListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GET_STUDENT_HOUSE_LIST_FAILURE:
            return { ...state, studentHouseListState: { loading: false, data: [], error: action.payload } };


        default:
            return state;
    }
}
export default sruReducer;