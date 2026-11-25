import {
    FETCH_LIST_OF_SECTION_REQUEST, FETCH_LIST_OF_SECTION_SUCCESS, FETCH_LIST_OF_SECTION_FAILURE,
    FETCH_ROW_SECTION_TABLE_REQUEST, FETCH_ROW_SECTION_TABLE_SUCCESS, FETCH_ROW_SECTION_TABLE_FAILURE,
    FETCH_ROW_STUDENT_TABLE_REQUEST, FETCH_ROW_STUDENT_TABLE_SUCCESS, FETCH_ROW_STUDENT_TABLE_FAILURE,
    FETCH_LIST_OF_SECTION_USER_REQUEST, FETCH_LIST_OF_SECTION_USER_SUCCESS, FETCH_LIST_OF_SECTION_USER_FAILURE,
    FETCH_TEACHER_SUBJECT_LOAD_REQUEST, FETCH_TEACHER_SUBJECT_LOAD_SUCCESS, FETCH_TEACHER_SUBJECT_LOAD_FAILURE,
    FETCH_LIST_OF_STUDENT_PER_TERM_REQUEST, FETCH_LIST_OF_STUDENT_PER_TERM_SUCCESS, FETCH_LIST_OF_STUDENT_PER_TERM_FAILURE,
    FETCH_INSERT_ENCODED_GRADES_REQUEST, FETCH_INSERT_ENCODED_GRADES_SUCCESS, FETCH_INSERT_ENCODED_GRADES_FAILURE,
    FETCH_FINALIZE_ENCODED_GRADES_REQUEST, FETCH_FINALIZE_ENCODED_GRADES_SUCCESS, FETCH_FINALIZE_ENCODED_GRADES_FAILURE,
    FETCH_SCHOOL_CALENDAR_STATUS_REQUEST, FETCH_SCHOOL_CALENDAR_STATUS_SUCCESS, FETCH_SCHOOL_CALENDAR_STATUS_FAILURE,
    FETCH_SECTION_STUDENTS_WITH_SUBJECTS_REQUEST, FETCH_SECTION_STUDENTS_WITH_SUBJECTS_SUCCESS, FETCH_SECTION_STUDENTS_WITH_SUBJECTS_FAILURE,
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
    schoolCalendarStatusState: { ...initialState },
    sectionStudentsWithSubjectsState: { ...initialState },
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

        case FETCH_SCHOOL_CALENDAR_STATUS_REQUEST:
            return { ...state, schoolCalendarStatusState: { loading: true, data: [], error: '' } };
        case FETCH_SCHOOL_CALENDAR_STATUS_SUCCESS:
            return { ...state, schoolCalendarStatusState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SCHOOL_CALENDAR_STATUS_FAILURE:
            return { ...state, schoolCalendarStatusState: { loading: false, data: [], error: action.payload } };

        case FETCH_SECTION_STUDENTS_WITH_SUBJECTS_REQUEST:
            return { ...state, sectionStudentsWithSubjectsState: { loading: true, data: [], error: '' } };
        case FETCH_SECTION_STUDENTS_WITH_SUBJECTS_SUCCESS:
            return { ...state, sectionStudentsWithSubjectsState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SECTION_STUDENTS_WITH_SUBJECTS_FAILURE:
            return { ...state, sectionStudentsWithSubjectsState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default teacherReducer;