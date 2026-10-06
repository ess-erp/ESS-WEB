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
    FETCH_SCHOOL_CALENDAR_TABLE_REQUEST, FETCH_SCHOOL_CALENDAR_TABLE_SUCCESS, FETCH_SCHOOL_CALENDAR_TABLE_FAILURE,
    FETCH_SCHOOL_CALENDAR_ACTIVITY_REQUEST, FETCH_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, FETCH_SCHOOL_CALENDAR_ACTIVITY_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_FAILURE,
    FETCH_UPDATE_SCHOOL_CALENDAR_REQUEST, FETCH_UPDATE_SCHOOL_CALENDAR_SUCCESS, FETCH_UPDATE_SCHOOL_CALENDAR_FAILURE,
    FETCH_DELETE_SCHOOL_CALENDAR_REQUEST, FETCH_DELETE_SCHOOL_CALENDAR_SUCCESS, FETCH_DELETE_SCHOOL_CALENDAR_FAILURE,
    FETCH_ENROLLMENT_HISTORY_TABLE_REQUEST, FETCH_ENROLLMENT_HISTORY_TABLE_SUCCESS, FETCH_ENROLLMENT_HISTORY_TABLE_FAILURE,
    FETCH_INSERT_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_INSERT_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_INSERT_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_ROW_GRADE_REPORT_TEMPLATE_REQUEST, FETCH_ROW_GRADE_REPORT_TEMPLATE_SUCCESS, FETCH_ROW_GRADE_REPORT_TEMPLATE_FAILURE,
    FETCH_SUMMARY_SHEET_TABLE_REQUEST, FETCH_SUMMARY_SHEET_TABLE_SUCCESS, FETCH_SUMMARY_SHEET_TABLE_FAILURE,
    FETCH_GENERATE_SUMMARY_SHEET_REQUEST, FETCH_GENERATE_SUMMARY_SHEET_SUCCESS, FETCH_GENERATE_SUMMARY_SHEET_FAILURE,
    FETCH_SECTION_LIST_BY_LEVEL_ID_REQUEST, FETCH_SECTION_LIST_BY_LEVEL_ID_SUCCESS, FETCH_SECTION_LIST_BY_LEVEL_ID_FAILURE,
    FETCH_SCHOOL_CALENDAR_MASTER_REQUEST, FETCH_SCHOOL_CALENDAR_MASTER_SUCCESS, FETCH_SCHOOL_CALENDAR_MASTER_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_MASTER_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_MASTER_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_MASTER_FAILURE,
    FETCH_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_INSERT_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_INSERT_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_INSERT_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_DELETE_SCHOOL_CALENDAR_CHILD_REQUEST, FETCH_DELETE_SCHOOL_CALENDAR_CHILD_SUCCESS, FETCH_DELETE_SCHOOL_CALENDAR_CHILD_FAILURE,
    FETCH_STUDENTS_IN_SECTION_REQUEST, FETCH_STUDENTS_IN_SECTION_SUCCESS, FETCH_STUDENTS_IN_SECTION_FAILURE,
    DELETE_SECTION_REQUEST, DELETE_SECTION_SUCCESS, DELETE_SECTION_FAILURE,
    DELETE_INACTIVE_SECTION_REQUEST, DELETE_INACTIVE_SECTION_SUCCESS, DELETE_INACTIVE_SECTION_FAILURE,
    FETCH_STUDENT_DOCUMENTS_LIST_REQUEST, FETCH_STUDENT_DOCUMENTS_LIST_SUCCESS, FETCH_STUDENT_DOCUMENTS_LIST_FAILURE,
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
    schoolCalendarTableState: { ...initialState },
    schoolCalendarActivityState: { ...initialState },
    insertActivityState: { ...initialState },
    updateCalendarState: { ...initialState },
    deleteCalendarState: { ...initialState },
    enrollmentHistoryTableState: { ...initialState },
    studentDocumentsListState: { ...initialState },
    insertGradeReportTemplateState: { ...initialState },
    gradeReportTableState: { ...initialState },
    rowGradeTemplateState: { ...initialState },
    summarySheetTableState: { ...initialState },
    generateSummarySheetState: { ...initialState },
    sectionLevelState: { ...initialState },
    schoolCalendarMasterState: { ...initialState },
    insertSchoolCalendarMasterState: { ...initialState },
    schoolCalendarChildState: { ...initialState },
    insertSchoolCalendarChildState: { ...initialState },
    updateSchoolCalendarChildState: { ...initialState },
    deleteSchoolCalendarChildState: { ...initialState },
    studentsInSectionState: { ...initialState },
    deleteSectionState: { ...initialState },
    deleteInactiveSectionState: { ...initialState },
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

        case FETCH_SCHOOL_CALENDAR_TABLE_REQUEST:
            return { ...state, schoolCalendarTableState: { loading: true, data: [], error: '' } };
        case FETCH_SCHOOL_CALENDAR_TABLE_SUCCESS:
            return { ...state, schoolCalendarTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SCHOOL_CALENDAR_TABLE_FAILURE:
            return { ...state, schoolCalendarTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_SCHOOL_CALENDAR_ACTIVITY_REQUEST:
            return { ...state, schoolCalendarActivityState: { loading: true, data: [], error: '' } };
        case FETCH_SCHOOL_CALENDAR_ACTIVITY_SUCCESS:
            return { ...state, schoolCalendarActivityState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SCHOOL_CALENDAR_ACTIVITY_FAILURE:
            return { ...state, schoolCalendarActivityState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_REQUEST:
            return { ...state, insertActivityState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_SUCCESS:
            return { ...state, insertActivityState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_ACTIVITY_FAILURE:
            return { ...state, insertActivityState: { loading: false, data: [], error: action.payload } };

        case FETCH_UPDATE_SCHOOL_CALENDAR_REQUEST:
            return { ...state, updateCalendarState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_SCHOOL_CALENDAR_SUCCESS:
            return { ...state, updateCalendarState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_SCHOOL_CALENDAR_FAILURE:
            return { ...state, updateCalendarState: { loading: false, data: [], error: action.payload } };

        case FETCH_DELETE_SCHOOL_CALENDAR_REQUEST:
            return { ...state, deleteCalendarState: { loading: true, data: [], error: '' } };
        case FETCH_DELETE_SCHOOL_CALENDAR_SUCCESS:
            return { ...state, deleteCalendarState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DELETE_SCHOOL_CALENDAR_FAILURE:
            return { ...state, deleteCalendarState: { loading: false, data: [], error: action.payload } };

        case FETCH_ENROLLMENT_HISTORY_TABLE_REQUEST:
            return { ...state, enrollmentHistoryTableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENT_HISTORY_TABLE_SUCCESS:
            return { ...state, enrollmentHistoryTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENT_HISTORY_TABLE_FAILURE:
            return { ...state, enrollmentHistoryTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_GRADE_REPORT_TEMPLATE_REQUEST:
            return { ...state, insertGradeReportTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_GRADE_REPORT_TEMPLATE_SUCCESS:
            return { ...state, insertGradeReportTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_GRADE_REPORT_TEMPLATE_FAILURE:
            return { ...state, insertGradeReportTemplateState: { loading: false, data: [], error: action.payload } };

        case FETCH_GRADE_REPORT_TEMPLATE_REQUEST:
            return { ...state, gradeReportTableState: { loading: true, data: [], error: '' } };
        case FETCH_GRADE_REPORT_TEMPLATE_SUCCESS:
            return { ...state, gradeReportTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GRADE_REPORT_TEMPLATE_FAILURE:
            return { ...state, gradeReportTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_ROW_GRADE_REPORT_TEMPLATE_REQUEST:
            return { ...state, rowGradeTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_ROW_GRADE_REPORT_TEMPLATE_SUCCESS:
            return { ...state, rowGradeTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ROW_GRADE_REPORT_TEMPLATE_FAILURE:
            return { ...state, rowGradeTemplateState: { loading: false, data: [], error: action.payload } };

        case FETCH_SUMMARY_SHEET_TABLE_REQUEST:
            return { ...state, summarySheetTableState: { loading: true, data: [], error: '' } };
        case FETCH_SUMMARY_SHEET_TABLE_SUCCESS:
            return { ...state, summarySheetTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SUMMARY_SHEET_TABLE_FAILURE:
            return { ...state, summarySheetTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_GENERATE_SUMMARY_SHEET_REQUEST:
            return { ...state, generateSummarySheetState: { loading: true, data: [], error: '' } };
        case FETCH_GENERATE_SUMMARY_SHEET_SUCCESS:
            return { ...state, generateSummarySheetState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GENERATE_SUMMARY_SHEET_FAILURE:
            return { ...state, generateSummarySheetState: { loading: false, data: [], error: action.payload } };

        case FETCH_SECTION_LIST_BY_LEVEL_ID_REQUEST:
            return { ...state, sectionLevelState: { loading: true, data: [], error: '' } };
        case FETCH_SECTION_LIST_BY_LEVEL_ID_SUCCESS:
            return { ...state, sectionLevelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SECTION_LIST_BY_LEVEL_ID_FAILURE:
            return { ...state, sectionLevelState: { loading: false, data: [], error: action.payload } };

        // School Calendar Master (School Year)
        case FETCH_SCHOOL_CALENDAR_MASTER_REQUEST:
            return { ...state, schoolCalendarMasterState: { loading: true, data: [], error: '' } };
        case FETCH_SCHOOL_CALENDAR_MASTER_SUCCESS:
            return { ...state, schoolCalendarMasterState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SCHOOL_CALENDAR_MASTER_FAILURE:
            return { ...state, schoolCalendarMasterState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_SCHOOL_CALENDAR_MASTER_REQUEST:
            return { ...state, insertSchoolCalendarMasterState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_MASTER_SUCCESS:
            return { ...state, insertSchoolCalendarMasterState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_MASTER_FAILURE:
            return { ...state, insertSchoolCalendarMasterState: { loading: false, data: [], error: action.payload } };

        // School Calendar Child (Activities)
        case FETCH_SCHOOL_CALENDAR_CHILD_REQUEST:
            return { ...state, schoolCalendarChildState: { loading: true, data: [], error: '' } };
        case FETCH_SCHOOL_CALENDAR_CHILD_SUCCESS:
            return { ...state, schoolCalendarChildState: { loading: false, data: action.payload, error: '' } };
        case FETCH_SCHOOL_CALENDAR_CHILD_FAILURE:
            return { ...state, schoolCalendarChildState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_SCHOOL_CALENDAR_CHILD_REQUEST:
            return { ...state, insertSchoolCalendarChildState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_CHILD_SUCCESS:
            return { ...state, insertSchoolCalendarChildState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_SCHOOL_CALENDAR_CHILD_FAILURE:
            return { ...state, insertSchoolCalendarChildState: { loading: false, data: [], error: action.payload } };

        case FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_REQUEST:
            return { ...state, updateSchoolCalendarChildState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_SUCCESS:
            return { ...state, updateSchoolCalendarChildState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATE_SCHOOL_CALENDAR_CHILD_FAILURE:
            return { ...state, updateSchoolCalendarChildState: { loading: false, data: [], error: action.payload } };

        case FETCH_DELETE_SCHOOL_CALENDAR_CHILD_REQUEST:
            return { ...state, deleteSchoolCalendarChildState: { loading: true, data: [], error: '' } };
        case FETCH_DELETE_SCHOOL_CALENDAR_CHILD_SUCCESS:
            return { ...state, deleteSchoolCalendarChildState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DELETE_SCHOOL_CALENDAR_CHILD_FAILURE:
            return { ...state, deleteSchoolCalendarChildState: { loading: false, data: [], error: action.payload } };

        // Students in Section
        case FETCH_STUDENTS_IN_SECTION_REQUEST:
            return { ...state, studentsInSectionState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTS_IN_SECTION_SUCCESS:
            return { ...state, studentsInSectionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTS_IN_SECTION_FAILURE:
            return { ...state, studentsInSectionState: { loading: false, data: [], error: action.payload } };

        // Delete Section
        case DELETE_SECTION_REQUEST:
            return { ...state, deleteSectionState: { loading: true, data: [], error: '' } };
        case DELETE_SECTION_SUCCESS:
            return { ...state, deleteSectionState: { loading: false, data: action.payload, error: '' } };
        case DELETE_SECTION_FAILURE:
            return { ...state, deleteSectionState: { loading: false, data: [], error: action.payload } };

        // Delete Inactive Section
        case DELETE_INACTIVE_SECTION_REQUEST:
            return { ...state, deleteInactiveSectionState: { loading: true, data: [], error: '' } };
        case DELETE_INACTIVE_SECTION_SUCCESS:
            return { ...state, deleteInactiveSectionState: { loading: false, data: action.payload, error: '' } };
        case DELETE_INACTIVE_SECTION_FAILURE:
            return { ...state, deleteInactiveSectionState: { loading: false, data: [], error: action.payload } };

        // Student Documents List
        case FETCH_STUDENT_DOCUMENTS_LIST_REQUEST:
            return { ...state, studentDocumentsListState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENT_DOCUMENTS_LIST_SUCCESS:
            return { ...state, studentDocumentsListState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENT_DOCUMENTS_LIST_FAILURE:
            return { ...state, studentDocumentsListState: { loading: false, data: [], error: action.payload } };

        default:
            return state;
    }
};

export default sruReducer;