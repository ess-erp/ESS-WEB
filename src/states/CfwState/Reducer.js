import { initial } from "lodash";
import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_INSERTEXAMROOM_REQUEST, FETCH_INSERTEXAMROOM_SUCCESS, FETCH_INSERTEXAMROOM_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_INSERTEXAMSCHEDULE_REQUEST, FETCH_INSERTEXAMSCHEDULE_SUCCESS, FETCH_INSERTEXAMSCHEDULE_FAILURE,
    FETCH_EXAMROOMTEMPLATE_REQUEST, FETCH_EXAMROOMTEMPLATE_SUCCESS, FETCH_EXAMROOMTEMPLATE_FAILURE,
    FETCH_UPDATEROWTABLE_REQUEST, FETCH_UPDATEROWTABLE_SUCCESS, FETCH_UPDATEROWTABLE_FAILURE,
    FETCH_INSERTTRANSMUTATIONTABLE_REQUEST, FETCH_INSERTTRANSMUTATIONTABLE_SUCCESS, FETCH_INSERTTRANSMUTATIONTABLE_FAILURE,
    FETCH_INSERTTRANSMUTATIONBULK_REQUEST, FETCH_INSERTTRANSMUTATIONBULK_SUCCESS, FETCH_INSERTTRANSMUTATIONBULK_FAILURE,
    FETCH_INSERTGENERALSUBJECTTABLE_REQUEST, FETCH_INSERTGENERALSUBJECTTABLE_SUCCESS, FETCH_INSERTGENERALSUBJECTTABLE_FAILURE,
    FETCH_GENERALSUBJECTTABLE_REQUEST, FETCH_GENERALSUBJECTTABLE_SUCCESS, FETCH_GENERALSUBJECTTABLE_FAILURE,
    FETCH_INSERTEXAMSUBJECT_REQUEST, FETCH_INSERTEXAMSUBJECT_SUCCESS, FETCH_INSERTEXAMSUBJECT_FAILURE,
    FETCH_TEMPLATEROWMODAL_REQUEST, FETCH_TEMPLATEROWMODAL_SUCCESS, FETCH_TEMPLATEROWMODAL_FAILURE,
    FETCH_UPDATEROWTEMPLATE_REQUEST, FETCH_UPDATEROWTEMPLATE_SUCCESS, FETCH_UPDATEROWTEMPLATE_FAILURE,
    FETCH_EXAMSETTINGSCODE_REQUEST, FETCH_EXAMSETTINGSCODE_SUCCESS, FETCH_EXAMSETTINGSCODE_FAILURE,
    FETCH_EXAMSCHEDULECREATED_REQUEST, FETCH_EXAMSCHEDULECREATED_SUCCESS, FETCH_EXAMSCHEDULECREATED_FAILURE,
    FETCH_EXAMSETTINGSCODEBYSTUDENTID_REQUEST, FETCH_EXAMSETTINGSCODEBYSTUDENTID_SUCCESS, FETCH_EXAMSETTINGSCODEBYSTUDENTID_FAILURE,
    FETCH_ALLUSERBYUSERROLE_REQUEST, FETCH_ALLUSERBYUSERROLE_SUCCESS, FETCH_ALLUSERBYUSERROLE_FAILURE,
    FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_REQUEST, FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_SUCCESS, FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_FAILURE,
    FETCH_EXAM_RAW_SCORE_TABLE_REQUEST, FETCH_EXAM_RAW_SCORE_TABLE_SUCCESS, FETCH_EXAM_RAW_SCORE_TABLE_FAILURE,
    FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_REQUEST, FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_SUCCESS, FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_FAILURE,
    // FETCH_RAW_SCORE_BY_STUDENT_REQUEST, FETCH_RAW_SCORE_BY_STUDENT_SUCCESS, FETCH_RAW_SCORE_BY_STUDENT_FAILURE,
    // FETCH_SUBJECTLIST_REQUEST, FETCH_SUBJECTLIST_SUCCESS, FETCH_SUBJECTLIST_FAILURE,
} from "./ActionType";

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    tableState: { ...initialState },
    insertExamRoomState: { ...initialState },
    templateTableState: { ...initialState },
    insertExamScheduleState: { ...initialState },
    examRoomTemplate: { ...initialState },
    updateTableState: { ...initialState },
    insertTransmutationTableState: { ...initialState },
    insertTransmutationBulkState: { ...initialState },
    insertGeneralSubjectTableState: { ...initialState },
    generalSubjectTableState: { ...initialState },
    insertExamSubejctState: { ...initialState },
    templateRowModalState: { ...initialState },
    rowUpdateState: { ...initialState },
    examSettingsCodeState: { ...initialState },
    examScheduleCreatedState: { ...initialState },
    examSettingsCodeByStudentIdState: { ...initialState },
    allUserByUserRoleState: { ...initialState },
    insertStudentExamCodeSettingsState: { ...initialState },
    rawScoreTableState: { ...initialState },
    insertRawScoreStudentIdState: { ...initialState },
    // rawScoreStudentState: { ...initialState },
    // subjectListState: { ...initialState },
}

const cfwReducer = (state = initialGeneralState, action) => {
    switch (action.type) {
        //Get Enrollment table
        case FETCH_ENROLLMENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        //insert exam room template
        case FETCH_INSERTEXAMROOM_REQUEST:
            return { ...state, insertExamRoomState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTEXAMROOM_SUCCESS:
            return { ...state, insertExamRoomState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTEXAMROOM_FAILURE:
            return { ...state, insertExamRoomState: { loading: false, data: [], error: action.payload } };

        //get exam room template
        case FETCH_EXAMROOMTEMPLATE_REQUEST:
            return { ...state, examRoomTemplate: { loading: true, data: [], error: '' } };
        case FETCH_EXAMROOMTEMPLATE_SUCCESS:
            return { ...state, examRoomTemplate: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMROOMTEMPLATE_FAILURE:
            return { ...state, examRoomTemplate: { loading: false, data: [], error: action.payload } };

        //insert exam schedule template
        case FETCH_INSERTEXAMSCHEDULE_REQUEST:
            return { ...state, insertExamScheduleState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTEXAMSCHEDULE_SUCCESS:
            return { ...state, insertExamScheduleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTEXAMSCHEDULE_FAILURE:
            return { ...state, insertExamScheduleState: { loading: false, data: [], error: action.payload } };

        //get all template
        case FETCH_TEMPLATETABLE_REQUEST:
            return { ...state, templateTableState: { loading: true, data: [], error: '' } };
        case FETCH_TEMPLATETABLE_SUCCESS:
            return { ...state, templateTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEMPLATETABLE_FAILURE:
            return { ...state, templateTableState: { loading: false, data: [], error: action.payload } };

        //enable and disable row in template table
        case FETCH_UPDATEROWTABLE_REQUEST:
            return { ...state, updateTableState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATEROWTABLE_SUCCESS:
            return { ...state, updateTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATEROWTABLE_FAILURE:
            return { ...state, updateTableState: { loading: false, data: [], error: action.payload } };

        //insert transmutation table only
        case FETCH_INSERTTRANSMUTATIONTABLE_REQUEST:
            return { ...state, insertTransmutationTableState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTTRANSMUTATIONTABLE_SUCCESS:
            return { ...state, insertTransmutationTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTTRANSMUTATIONTABLE_FAILURE:
            return { ...state, insertTransmutationTableState: { loading: false, data: [], error: action.payload } };

        //insert transmutation by bulk
        case FETCH_INSERTTRANSMUTATIONBULK_REQUEST:
            return { ...state, insertTransmutationBulkState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTTRANSMUTATIONBULK_SUCCESS:
            return { ...state, insertTransmutationBulkState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTTRANSMUTATIONBULK_FAILURE:
            return { ...state, insertTransmutationBulkState: { loading: false, data: [], error: action.payload } };

        //insert subject settings table
        case FETCH_INSERTGENERALSUBJECTTABLE_REQUEST:
            return { ...state, insertGeneralSubjectTableState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTGENERALSUBJECTTABLE_SUCCESS:
            return { ...state, insertGeneralSubjectTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTGENERALSUBJECTTABLE_FAILURE:
            return { ...state, insertGeneralSubjectTableState: { loading: false, data: [], error: action.payload } };

        //get the general offered subject table using dataTable
        case FETCH_GENERALSUBJECTTABLE_REQUEST:
            return { ...state, generalSubjectTableState: { loading: true, data: [], error: '' } };
        case FETCH_GENERALSUBJECTTABLE_SUCCESS:
            return { ...state, generalSubjectTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GENERALSUBJECTTABLE_FAILURE:
            return { ...state, generalSubjectTableState: { loading: false, data: '', error: action.payload } };


        //insert exam subject in CFW templates
        case FETCH_INSERTEXAMSUBJECT_REQUEST:
            return { ...state, insertExamSubejctState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTEXAMSUBJECT_SUCCESS:
            return { ...state, insertExamSubejctState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTEXAMSUBJECT_FAILURE:
            return { ...state, insertExamSubejctState: { loading: false, data: '', error: action.payload } };

        //get row modal in template page
        case FETCH_TEMPLATEROWMODAL_REQUEST:
            return { ...state, templateRowModalState: { loading: true, data: [], error: '' } };
        case FETCH_TEMPLATEROWMODAL_SUCCESS:
            return { ...state, templateRowModalState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEMPLATEROWMODAL_FAILURE:
            return { ...state, templateRowModalState: { loading: false, data: '', error: action.payload } };

        //Update the row template
        case FETCH_UPDATEROWTEMPLATE_REQUEST:
            return { ...state, rowUpdateState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATEROWTEMPLATE_SUCCESS:
            return { ...state, rowUpdateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATEROWTEMPLATE_FAILURE:
            return { ...state, rowUpdateState: { loading: false, data: [], error: action.payload } };

        //get exam code table in cfw
        case FETCH_EXAMSETTINGSCODE_REQUEST:
            return { ...state, examSettingsCodeState: { loading: true, data: [], error: '' } };
        case FETCH_EXAMSETTINGSCODE_SUCCESS:
            return { ...state, examSettingsCodeState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMSETTINGSCODE_FAILURE:
            return { ...state, examSettingsCodeState: { loading: false, data: [], error: action.payload } };

        case FETCH_EXAMSCHEDULECREATED_REQUEST:
            return { ...state, examScheduleCreatedState: { loading: true, data: [], error: '' } };
        case FETCH_EXAMSCHEDULECREATED_SUCCESS:
            return { ...state, examScheduleCreatedState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMSCHEDULECREATED_FAILURE:
            return { ...state, examScheduleCreatedState: { loading: false, data: [], error: action.payload } };

        case FETCH_EXAMSETTINGSCODEBYSTUDENTID_REQUEST:
            return { ...state, examSettingsCodeByStudentIdState: { loading: true, data: [], error: '' } };
        case FETCH_EXAMSETTINGSCODEBYSTUDENTID_SUCCESS:
            return { ...state, examSettingsCodeByStudentIdState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMSETTINGSCODEBYSTUDENTID_FAILURE:
            return { ...state, examSettingsCodeByStudentIdState: { loading: false, data: [], error: action.payload } };

        case FETCH_ALLUSERBYUSERROLE_REQUEST:
            return { ...state, allUserByUserRoleState: { loading: true, data: [], error: '' } };
        case FETCH_ALLUSERBYUSERROLE_SUCCESS:
            return { ...state, allUserByUserRoleState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ALLUSERBYUSERROLE_FAILURE:
            return { ...state, allUserByUserRoleState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_REQUEST:
            return { ...state, insertStudentExamCodeSettingsState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_SUCCESS:
            return { ...state, insertStudentExamCodeSettingsState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_STUDENT_EXAM_CODE_SETTINGS_FAILURE:
            return { ...state, insertStudentExamCodeSettingsState: { loading: false, data: [], error: action.payload } };

        case FETCH_EXAM_RAW_SCORE_TABLE_REQUEST:
            return { ...state, rawScoreTableState: { loading: true, data: [], error: '' } };
        case FETCH_EXAM_RAW_SCORE_TABLE_SUCCESS:
            return { ...state, rawScoreTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAM_RAW_SCORE_TABLE_FAILURE:
            return { ...state, rawScoreTableState: { loading: false, data: [], error: action.payload } };

        case FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_REQUEST:
            return { ...state, insertRawScoreStudentIdState: { loading: true, data: [], error: '' } };
        case FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_SUCCESS:
            return { ...state, insertRawScoreStudentIdState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERT_RAW_SCORE_BY_STUDENT_ID_FAILURE:
            return { ...state, insertRawScoreStudentIdState: { loading: false, data: [], error: action.payload } };

        // case FETCH_RAW_SCORE_BY_STUDENT_REQUEST:
        //     return { ...state, rawScoreStudentState: { loading: true, data: [], error: '' } };
        // case FETCH_RAW_SCORE_BY_STUDENT_SUCCESS:
        //     return { ...state, rawScoreStudentState: { loading: false, data: action.payload, error: '' } };
        // case FETCH_RAW_SCORE_BY_STUDENT_FAILURE:
        //     return { ...state, rawScoreStudentState: { loading: false, data: [], error: action.payload } };

        // //get offered subject table in cfw
        // case FETCH_SUBJECTLIST_REQUEST:
        // case FETCH_SUBJECTLIST_SUCCESS:
        //     return { ...state, subjectListState: { loading: false, data: action.payload, error: '' } };
        // case FETCH_SUBJECTLIST_FAILURE:
        //     return { ...state, subjectListState: { loading: false, data: [], error: action.payload } };



        default:
            return state;
    }
}
export default cfwReducer;