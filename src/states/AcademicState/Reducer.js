import {
    FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_INSERT_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_GENERAL_OFFERED_SUBJECTS_REQUEST, FETCH_GENERAL_OFFERED_SUBJECTS_SUCCESS, FETCH_GENERAL_OFFERED_SUBJECTS_FAILURE,
    FETCH_INSERT_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_INSERT_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_INSERT_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST, FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS, FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE,
    FETCH_SECTION_LIST_REQUEST, FETCH_SECTION_LIST_SUCCESS, FETCH_SECTION_LIST_FAILURE,
    FETCH_NON_CURRICULUM_REQUEST, FETCH_NON_CURRICULUM_SUCCESS, FETCH_NON_CURRICULUM_FAILURE,
    FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_REQUEST, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_SUCCESS, FETCH_CURRICULUM_AND_NON_CURRICULUM_SUBJECT_FAILURE,
    FETCH_INSERT_SUBJECT_SCHEDULE_REQUEST, FETCH_INSERT_SUBJECT_SCHEDULE_SUCCESS, FETCH_INSERT_SUBJECT_SCHEDULE_FAILURE,
    FETCH_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_MASTER_SUBJECT_SCHEDULE_TABLE_FAILURE,
    FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_REQUEST, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_SUCCESS, FETCH_SECTION_SUBJECT_SCHEDULE_TABLE_FAILURE,
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
    insertNonCurriculumSubjectState: { ...initialDataState },
    nonCurriculumSubjectState: { ...initialDataState },
    subjectScheduleState: { ...initialDataState },
    sectionListState: { ...initialDataState },
    nonCurriculumState: { ...initialDataState },
    curriculumAndNonCurriculumSubjectState: { ...initialDataState },
    insertSubjectScheduleState: { ...initialDataState },
    subjectScheduleState: { ...initialDataState },
    masterSubjectScheduleState: { ...initialDataState },
    sectionSubjectScheduleState: { ...initialDataState },
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

        case FETCH_SUBJECT_SCHEDULE_LOAD_REQUEST:
            return { ...state, subjectScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_SUBJECT_SCHEDULE_LOAD_SUCCESS:
            return { ...state, subjectScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SUBJECT_SCHEDULE_LOAD_FAILURE:
            return { ...state, subjectScheduleState: { loading: false, data: [], error: action.payload } };

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

        default:
            return state;
    }
}
export default academicReducer;