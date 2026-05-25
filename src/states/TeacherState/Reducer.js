import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
    FETCH_ROW_SECTION_TABLE_REQUEST, FETCH_ROW_SECTION_TABLE_SUCCESS, FETCH_ROW_SECTION_TABLE_FAILURE,
    FETCH_ROW_STUDENT_TABLE_REQUEST, FETCH_ROW_STUDENT_TABLE_SUCCESS, FETCH_ROW_STUDENT_TABLE_FAILURE,
    FETCH_LIST_OF_SECTION_USER_REQUEST, FETCH_LIST_OF_SECTION_USER_SUCCESS, FETCH_LIST_OF_SECTION_USER_FAILURE,
    FETCH_TEACHER_SUBJECT_LOAD_REQUEST, FETCH_TEACHER_SUBJECT_LOAD_SUCCESS, FETCH_TEACHER_SUBJECT_LOAD_FAILURE,
    FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST, FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS, FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE,
    FETCH_INSERT_ENCODED_GRADES_REQUEST, FETCH_INSERT_ENCODED_GRADES_SUCCESS, FETCH_INSERT_ENCODED_GRADES_FAILURE,
    FETCH_FINALIZE_ENCODED_GRADES_REQUEST, FETCH_FINALIZE_ENCODED_GRADES_SUCCESS, FETCH_FINALIZE_ENCODED_GRADES_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialDataState = {
    listOfSectionState: { ...initialState },
    rowSectionTableState: { ...initialState },
    studentTableState: { ...initialState },
    sectionTableList: { ...initialState },
    teacherSubjectLoadState: { ...initialState },
    linkOfStudentPerTermState: { ...initialState },
    insertEncodedGradesState: { ...initialState },
};

const teacherReducer = (state = initialDataState, action) => {
    switch (action.type) {

        case FETCH_LIST_OF_SECTION_REQUEST:
            return { ...state, listOfSectionState: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_SECTION_SUCCESS:
            return { ...state, listOfSectionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_SECTION_FAILURE:
            return { ...state, listOfSectionState: { loading: false, data: [], error: action.payload } };

        case FETCH_ROW_SECTION_TABLE_REQUEST:
            return { ...state, rowSectionTableState: { loading: true, data: [], error: '' } };
        case FETCH_ROW_SECTION_TABLE_SUCCESS:
            return { ...state, rowSectionTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ROW_SECTION_TABLE_FAILURE:
            return { ...state, rowSectionTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_ROW_STUDENT_TABLE_REQUEST:
            return { ...state, studentTableState: { loading: true, data: [], error: '' } };
        case FETCH_ROW_STUDENT_TABLE_SUCCESS:
            return { ...state, studentTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ROW_STUDENT_TABLE_FAILURE:
            return { ...state, studentTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_LIST_OF_SECTION_USER_REQUEST:
            return { ...state, sectionTableList: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_SECTION_USER_SUCCESS:
            return { ...state, sectionTableList: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_SECTION_USER_FAILURE:
            return { ...state, sectionTableList: { loading: false, data: [], error: action.payload } };

        case FETCH_TEACHER_SUBJECT_LOAD_REQUEST:
            return { ...state, teacherSubjectLoadState: { loading: true, data: [], error: '' } };
        case FETCH_TEACHER_SUBJECT_LOAD_SUCCESS:
            return { ...state, teacherSubjectLoadState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEACHER_SUBJECT_LOAD_FAILURE:
            return { ...state, teacherSubjectLoadState: { loading: false, data: [], error: action.payload } };

        case FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST:
            return { ...state, linkOfStudentPerTermState: { loading: true, data: [], error: '' } };
        case FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS:
            return { ...state, linkOfStudentPerTermState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE:
            return { ...state, linkOfStudentPerTermState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_ENCODED_GRADES_REQUEST:
            return { ...state, insertEncodedGradesState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_ENCODED_GRADES_SUCCESS:
            return { ...state, insertEncodedGradesState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_ENCODED_GRADES_FAILURE:
            return { ...state, insertEncodedGradesState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default teacherReducer;