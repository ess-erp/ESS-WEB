import {
    FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE,
    UPDATE_GENERAL_OFFERED_SUBJECT_REQUEST, UPDATE_GENERAL_OFFERED_SUBJECT_SUCCESS, UPDATE_GENERAL_OFFERED_SUBJECT_FAILURE,
    TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_REQUEST, TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_SUCCESS, TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_FAILURE,
    FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_NON_CURRICULUM_SUBJECT_FAILURE,
    UPDATE_NON_CURRICULUM_SUBJECT_REQUEST, UPDATE_NON_CURRICULUM_SUBJECT_SUCCESS, UPDATE_NON_CURRICULUM_SUBJECT_FAILURE,
    TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_REQUEST, TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_SUCCESS, TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_FAILURE,
    // FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST, FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE,
    FETCH_SECTION_LIST_REQUEST, FETCH_SECTION_LIST_SUCCESS, FETCH_SECTION_LIST_FAILURE,
    FETCH_NON_CURRICULUM_REQUEST, FETCH_NON_CURRICULUM_SUCCESS, FETCH_NON_CURRICULUM_FAILURE,
    FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST, FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS, FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE,
    FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_TEACHER_LIST_REQUEST, FETCH_TEACHER_LIST_SUCCESS, FETCH_TEACHER_LIST_FAILURE,
    FETCH_TEACHER_TABLE_REQUEST, FETCH_TEACHER_TABLE_SUCCESS, FETCH_TEACHER_TABLE_FAILURE,
    FETCH_ADVISER_NON_ADVISER_REQUEST, FETCH_ADVISER_NON_ADVISER_SUCCESS, FETCH_ADVISER_NON_ADVISER_FAILURE,
    FETCH_TEACHER_ALREADY_ASSIGN_REQUEST, FETCH_TEACHER_ALREADY_ASSIGN_SUCCESS, FETCH_TEACHER_ALREADY_ASSIGN_FAILURE,
    FETCH_INSERT_FACULTY_LOAD_REQUEST, FETCH_INSERT_FACULTY_LOAD_SUCCESS, FETCH_INSERT_FACULTY_LOAD_FAILURE,
    FETCH_FACULTY_LOAD_TABLE_REQUEST, FETCH_FACULTY_LOAD_TABLE_SUCCESS, FETCH_FACULTY_LOAD_TABLE_FAILURE,
    FETCH_FACULTY_LOAD_ROW_TABLE_REQUEST, FETCH_FACULTY_LOAD_ROW_TABLE_SUCCESS, FETCH_FACULTY_LOAD_ROW_TABLE_FAILURE,
    FETCH_SECTION_PER_LEVEL_REQUEST, FETCH_SECTION_PER_LEVEL_SUCCESS, FETCH_SECTION_PER_LEVEL_FAILURE,
    FETCH_INSERT_CURRICULUM_PER_LEVEL_REQUEST, FETCH_INSERT_CURRICULUM_PER_LEVEL_SUCCESS, FETCH_INSERT_CURRICULUM_PER_LEVEL_FAILURE,
    FETCH_CURRICULUM_PER_LEVEL_REQUEST, FETCH_CURRICULUM_PER_LEVEL_SUCCESS, FETCH_CURRICULUM_PER_LEVEL_FAILURE,
    FETCH_CURRICULUM_LIST_REQUEST, FETCH_CURRICULUM_LIST_SUCCESS, FETCH_CURRICULUM_LIST_FAILURE,
    FETCH_CURRICULUM_TABLE_REQUEST, FETCH_CURRICULUM_TABLE_SUCCESS, FETCH_CURRICULUM_TABLE_FAILURE,
    FETCH_STUDENT_HOLD_TABLE_REQUEST, FETCH_STUDENT_HOLD_TABLE_SUCCESS, FETCH_STUDENT_HOLD_TABLE_FAILURE,
    CREATE_STUDENT_HOLD_REQUEST, CREATE_STUDENT_HOLD_SUCCESS, CREATE_STUDENT_HOLD_FAILURE,
    REMOVE_STUDENT_HOLD_REQUEST, REMOVE_STUDENT_HOLD_SUCCESS, REMOVE_STUDENT_HOLD_FAILURE,
    SEARCH_STUDENT_FOR_HOLD_REQUEST, SEARCH_STUDENT_FOR_HOLD_SUCCESS, SEARCH_STUDENT_FOR_HOLD_FAILURE,
} from "./ActionType";

const initialDataState = {
    loading: false,
    data: [],
    error: '',
    success: false,
};

const initialState = {
    insertGeneralOfferedSubjectState: { ...initialDataState },
    generalOfferedSubjectState: { ...initialDataState },
    updateGeneralOfferedSubjectState: { ...initialDataState },
    toggleGeneralOfferedSubjectStatusState: { ...initialDataState },
    insertNonCurriculumSubjectState: { ...initialDataState },
    nonCurriculumSubjectState: { ...initialDataState },
    updateNonCurriculumSubjectState: { ...initialDataState },
    toggleNonCurriculumSubjectStatusState: { ...initialDataState },
    // subjectScheduleState: { ...initialDataState },
    sectionListState: { ...initialDataState },
    nonCurriculumState: { ...initialDataState },
    curriculumAndNonCurriculumSubjectState: { ...initialDataState },
    insertSubjectScheduleState: { ...initialDataState },
    subjectScheduleState: { ...initialDataState },
    masterSubjectScheduleState: { ...initialDataState },
    sectionSubjectScheduleState: { ...initialDataState },
    teacherListState: { ...initialDataState },
    teacherTableState: { ...initialDataState },
    adviserNonAdviserState: { ...initialDataState },
    teacherAlreadyAssignState: { ...initialDataState },
    facultyLoadState: { ...initialDataState },
    facultyLoadTableState: { ...initialDataState },
    loadTableState: { ...initialDataState },
    sectionPerLevelState: { ...initialDataState },
    insertCurriculumPerLevelState: { ...initialDataState },
    curriculumPerLevelState: { ...initialDataState },
    curriculumListState: { ...initialDataState },
    curriculumTableState: { ...initialDataState },
    studentHoldTableState: { ...initialDataState, totalRecords: 0 },
    createStudentHoldState: { ...initialDataState },
    removeStudentHoldState: { ...initialDataState },
    searchStudentForHoldState: { ...initialDataState },
};

const academicReducer = (state = initialState, action) => {
    switch (action.type) {

        // Get the template table
        case FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST:
            return { ...state, generalOfferedSubjectState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS:
            return { ...state, generalOfferedSubjectState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE:
            return { ...state, generalOfferedSubjectState: { loading: false, data: [], error: action.payload } };

        case FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST:
            return { ...state, generalOfferedSubjectState: { loading: true, data: [], error: '' } };
        case FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS:
            return { ...state, generalOfferedSubjectState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE:
            return { ...state, generalOfferedSubjectState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST:
            return { ...state, insertNonCurriculumSubjectState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS:
            return { ...state, insertNonCurriculumSubjectState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE:
            return { ...state, insertNonCurriculumSubjectState: { loading: false, data: [], error: action.payload } };

        case FETCH_NON_CURRICULUM_SUBJECT_REQUEST:
            return { ...state, nonCurriculumSubjectState: { loading: true, data: [], error: '' } };
        case FETCH_NON_CURRICULUM_SUBJECT_SUCCESS:
            return { ...state, nonCurriculumSubjectState: { loading: false, data: action.payload, error: '' } };
        case FETCH_NON_CURRICULUM_SUBJECT_FAILURE:
            return { ...state, nonCurriculumSubjectState: { loading: false, data: [], error: action.payload } };

        // case FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST:
        //     return { ...state, subjectScheduleState: { loading: true, data: [], error: '' } };
        // case FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS:
        //     return { ...state, subjectScheduleState: { loading: false, data: action.payload, error: '' } };
        // case FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE:
        //     return { ...state, subjectScheduleState: { loading: false, data: [], error: action.payload } };

        case FETCH_SECTION_LIST_REQUEST:
            return { ...state, sectionListState: { loading: true, data: [], error: '' } };
        case FETCH_SECTION_LIST_SUCCESS:
            return { ...state, sectionListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SECTION_LIST_FAILURE:
            return { ...state, sectionListState: { loading: false, data: [], error: action.payload } };

        case FETCH_NON_CURRICULUM_REQUEST:
            return { ...state, nonCurriculumState: { loading: true, data: [], error: '' } };
        case FETCH_NON_CURRICULUM_SUCCESS:
            return { ...state, nonCurriculumState: { loading: false, data: action.payload, error: '' } };
        case FETCH_NON_CURRICULUM_FAILURE:
            return { ...state, nonCurriculumState: { loading: false, data: [], error: action.payload } };

        case FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST:
            return { ...state, curriculumAndNonCurriculumSubjectState: { loading: true, data: [], error: '' } };
        case FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS:
            return { ...state, curriculumAndNonCurriculumSubjectState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE:
            return { ...state, curriculumAndNonCurriculumSubjectState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST:
            return { ...state, insertSubjectScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS:
            return { ...state, insertSubjectScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE:
            return { ...state, insertSubjectScheduleState: { loading: false, data: [], error: action.payload } };

        case FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST:
            return { ...state, subjectScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS:
            return { ...state, subjectScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE:
            return { ...state, subjectScheduleState: { loading: false, data: [], error: action.payload } };

        case FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST:
            return { ...state, masterSubjectScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS:
            return { ...state, masterSubjectScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE:
            return { ...state, masterSubjectScheduleState: { loading: false, data: [], error: action.payload } };

        case FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST:
            return { ...state, sectionSubjectScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS:
            return { ...state, sectionSubjectScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE:
            return { ...state, sectionSubjectScheduleState: { loading: false, data: [], error: action.payload } };

        case FETCH_TEACHER_LIST_REQUEST:
            return { ...state, teacherListState: { loading: true, data: [], error: '' } };
        case FETCH_TEACHER_LIST_SUCCESS:
            return { ...state, teacherListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEACHER_LIST_FAILURE:
            return { ...state, teacherListState: { loading: false, data: [], error: action.payload } };

        case FETCH_TEACHER_TABLE_REQUEST:
            return { ...state, teacherTableState: { loading: true, data: [], error: '' } };
        case FETCH_TEACHER_TABLE_SUCCESS:
            return { ...state, teacherTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEACHER_TABLE_FAILURE:
            return { ...state, teacherTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_ADVISER_NON_ADVISER_REQUEST:
            return { ...state, adviserNonAdviserState: { loading: true, data: [], error: '' } };
        case FETCH_ADVISER_NON_ADVISER_SUCCESS:
            return { ...state, adviserNonAdviserState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ADVISER_NON_ADVISER_FAILURE:
            return { ...state, adviserNonAdviserState: { loading: false, data: [], error: action.payload } };

        case FETCH_TEACHER_ALREADY_ASSIGN_REQUEST:
            return { ...state, teacherAlreadyAssignState: { loading: true, data: [], error: '' } };
        case FETCH_TEACHER_ALREADY_ASSIGN_SUCCESS:
            return { ...state, teacherAlreadyAssignState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEACHER_ALREADY_ASSIGN_FAILURE:
            return { ...state, teacherAlreadyAssignState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_FACULTY_LOAD_REQUEST:
            return { ...state, teacherAlreadyAssignState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_FACULTY_LOAD_SUCCESS:
            return { ...state, teacherAlreadyAssignState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_FACULTY_LOAD_FAILURE:
            return { ...state, teacherAlreadyAssignState: { loading: false, data: [], error: action.payload } };

        case FETCH_FACULTY_LOAD_TABLE_REQUEST:
            return { ...state, facultyLoadTableState: { loading: true, data: [], error: '' } };
        case FETCH_FACULTY_LOAD_TABLE_SUCCESS:
            return { ...state, facultyLoadTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_FACULTY_LOAD_TABLE_FAILURE:
            return { ...state, facultyLoadTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_FACULTY_LOAD_ROW_TABLE_REQUEST:
            return { ...state, loadTableState: { loading: true, data: [], error: '' } };
        case FETCH_FACULTY_LOAD_ROW_TABLE_SUCCESS:
            return { ...state, loadTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_FACULTY_LOAD_ROW_TABLE_FAILURE:
            return { ...state, loadTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_SECTION_PER_LEVEL_REQUEST:
            return { ...state, sectionPerLevelState: { loading: true, data: [], error: '' } };
        case FETCH_SECTION_PER_LEVEL_SUCCESS:
            return { ...state, sectionPerLevelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SECTION_PER_LEVEL_FAILURE:
            return { ...state, sectionPerLevelState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_CURRICULUM_PER_LEVEL_REQUEST:
            return { ...state, insertCurriculumPerLevelState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_CURRICULUM_PER_LEVEL_SUCCESS:
            return { ...state, insertCurriculumPerLevelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_CURRICULUM_PER_LEVEL_FAILURE:
            return { ...state, insertCurriculumPerLevelState: { loading: false, data: [], error: action.payload } };

        case FETCH_CURRICULUM_PER_LEVEL_REQUEST:
            return { ...state, curriculumPerLevelState: { loading: true, data: [], error: '' } };
        case FETCH_CURRICULUM_PER_LEVEL_SUCCESS:
            return { ...state, curriculumPerLevelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CURRICULUM_PER_LEVEL_FAILURE:
            return { ...state, curriculumPerLevelState: { loading: false, data: [], error: action.payload } };

        case FETCH_CURRICULUM_LIST_REQUEST:
            return { ...state, curriculumListState: { loading: true, data: [], error: '' } };
        case FETCH_CURRICULUM_LIST_SUCCESS:
            return { ...state, curriculumListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CURRICULUM_LIST_FAILURE:
            return { ...state, curriculumListState: { loading: false, data: [], error: action.payload } };

        case FETCH_CURRICULUM_TABLE_REQUEST:
            return { ...state, curriculumTableState: { loading: true, data: [], error: '' } };
        case FETCH_CURRICULUM_TABLE_SUCCESS:
            return { ...state, curriculumTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_CURRICULUM_TABLE_FAILURE:
            return { ...state, curriculumTableState: { loading: false, data: [], error: action.payload } };
        // Update General Offered Subject
        case UPDATE_GENERAL_OFFERED_SUBJECT_REQUEST:
            return { ...state, updateGeneralOfferedSubjectState: { loading: true, data: [], error: '', success: false } };
        case UPDATE_GENERAL_OFFERED_SUBJECT_SUCCESS:
            return { ...state, updateGeneralOfferedSubjectState: { loading: false, data: action.payload, error: '', success: true } };
        case UPDATE_GENERAL_OFFERED_SUBJECT_FAILURE:
            return { ...state, updateGeneralOfferedSubjectState: { loading: false, data: [], error: action.payload, success: false } };

        // Toggle General Offered Subject Status
        case TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_REQUEST:
            return { ...state, toggleGeneralOfferedSubjectStatusState: { loading: true, data: [], error: '', success: false } };
        case TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_SUCCESS:
            return { ...state, toggleGeneralOfferedSubjectStatusState: { loading: false, data: action.payload, error: '', success: true } };
        case TOGGLE_GENERAL_OFFERED_SUBJECT_STATUS_FAILURE:
            return { ...state, toggleGeneralOfferedSubjectStatusState: { loading: false, data: [], error: action.payload, success: false } };

        // Update Non-Curriculum Subject
        case UPDATE_NON_CURRICULUM_SUBJECT_REQUEST:
            return { ...state, updateNonCurriculumSubjectState: { loading: true, data: [], error: '', success: false } };
        case UPDATE_NON_CURRICULUM_SUBJECT_SUCCESS:
            return { ...state, updateNonCurriculumSubjectState: { loading: false, data: action.payload, error: '', success: true } };
        case UPDATE_NON_CURRICULUM_SUBJECT_FAILURE:
            return { ...state, updateNonCurriculumSubjectState: { loading: false, data: [], error: action.payload, success: false } };

        // Toggle Non-Curriculum Subject Status
        case TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_REQUEST:
            return { ...state, toggleNonCurriculumSubjectStatusState: { loading: true, data: [], error: '', success: false } };
        case TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_SUCCESS:
            return { ...state, toggleNonCurriculumSubjectStatusState: { loading: false, data: action.payload, error: '', success: true } };
        case TOGGLE_NON_CURRICULUM_SUBJECT_STATUS_FAILURE:
            return { ...state, toggleNonCurriculumSubjectStatusState: { loading: false, data: [], error: action.payload, success: false } };

        // Student Hold Table
        case FETCH_STUDENT_HOLD_TABLE_REQUEST:
            return { ...state, studentHoldTableState: { loading: true, data: [], error: '', totalRecords: 0 } };
        case FETCH_STUDENT_HOLD_TABLE_SUCCESS:
            return { ...state, studentHoldTableState: { loading: false, data: action.payload.data || [], error: '', totalRecords: action.payload.totalRecords || 0 } };
        case FETCH_STUDENT_HOLD_TABLE_FAILURE:
            return { ...state, studentHoldTableState: { loading: false, data: [], error: action.payload, totalRecords: 0 } };

        // Create Student Hold
        case CREATE_STUDENT_HOLD_REQUEST:
            return { ...state, createStudentHoldState: { loading: true, data: null, error: '' } };
        case CREATE_STUDENT_HOLD_SUCCESS:
            return { ...state, createStudentHoldState: { loading: false, data: action.payload, error: '' } };
        case CREATE_STUDENT_HOLD_FAILURE:
            return { ...state, createStudentHoldState: { loading: false, data: null, error: action.payload } };

        // Remove Student Hold
        case REMOVE_STUDENT_HOLD_REQUEST:
            return { ...state, removeStudentHoldState: { loading: true, data: null, error: '' } };
        case REMOVE_STUDENT_HOLD_SUCCESS:
            return { ...state, removeStudentHoldState: { loading: false, data: action.payload, error: '' } };
        case REMOVE_STUDENT_HOLD_FAILURE:
            return { ...state, removeStudentHoldState: { loading: false, data: null, error: action.payload } };

        // Search Student For Hold
        case SEARCH_STUDENT_FOR_HOLD_REQUEST:
            return { ...state, searchStudentForHoldState: { loading: true, data: [], error: '' } };
        case SEARCH_STUDENT_FOR_HOLD_SUCCESS:
            return { ...state, searchStudentForHoldState: { loading: false, data: action.payload || [], error: '' } };
        case SEARCH_STUDENT_FOR_HOLD_FAILURE:
            return { ...state, searchStudentForHoldState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
}
export default academicReducer;

// NOTE: The new reducer cases for UPDATE and TOGGLE actions should be added before the default case in the switch statement above

