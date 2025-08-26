import {
    FETCH_ENROLLMENTTABLE_REQUEST, FETCH_ENROLLMENTTABLE_SUCCESS, FETCH_ENROLLMENTTABLE_FAILURE,
    FETCH_STUDENTBYID_REQUEST, FETCH_STUDENTBYID_SUCCESS, FETCH_STUDENTBYID_FAILURE,
    FETCH_INSERTTEMPLATEFORM_REQUEST, FETCH_INSERTTEMPLATEFORM_SUCCESS, FETCH_INSERTTEMPLATEFORM_FAILURE,
    FETCH_LEVEL_REQUEST, FETCH_LEVEL_SUCCESS, FETCH_LEVEL_FAILURE,
    FETCH_DIVISION_REQUEST, FETCH_DIVISION_SUCCESS, FETCH_DIVISION_FAILURE,
    FETCH_TEMPLATETABLE_REQUEST, FETCH_TEMPLATETABLE_SUCCESS, FETCH_TEMPLATETABLE_FAILURE,
    FETCH_ROWTEMPLATETABLE_REQUEST, FETCH_ROWTEMPLATETABLE_SUCCESS, FETCH_ROWTEMPLATETABLE_FAILURE,
    FETCH_UPDATEROWTEMPLATE_REQUEST, FETCH_UPDATEROWTEMPLATE_SUCCESS, FETCH_UPDATEROWTEMPLATE_FAILURE,
    FETCH_DOCUMENTTABLE_REQUEST, FETCH_DOCUMENTTABLE_SUCCESS, FETCH_DOCUMENTTABLE_FAILURE,
    FETCH_INSERTDOCUMENT_REQUEST, FETCH_INSERTDOCUMENT_SUCCESS, FETCH_INSERTDOCUMENT_FAILURE,
    FETCH_GPATABLE_REQUEST, FETCH_GPATABLE_SUCCESS, FETCH_GPATABLE_FAILURE,
    FETCH_INSERTGPATABLE_REQUEST, FETCH_INSERTGPATABLE_SUCCESS, FETCH_INSERTGPATABLE_FAILURE,
    FETCH_EXAMINATIONSCHEDULER_REQUEST, FETCH_EXAMINATIONSCHEDULER_SUCCESS, FETCH_EXAMINATIONSCHEDULER_FAILURE,
    FETCH_EXAMSCHEDTEMPLATE_REQUEST, FETCH_EXAMSCHEDTEMPLATE_SUCCESS, FETCH_EXAMSCHEDTEMPLATE_FAILURE,
} from './ActionType';

const initialState = {
    loading: false,
    data: [],
    error: '',
    success: false,
}

const initialGeneralState = {
    tableState: { ...initialState },
    studentDataState: { ...initialState },
    insertTemplateState: { ...initialState },
    levelState: { ...initialState },
    divisionState: { ...initialState },
    templateTableState: { ...initialState},
    rowTemplateTableState: { ...initialState },
    rowUpdateState: { ...initialState },
    documentTableState: {  ...initialState },
    insertDocumentState: { ...initialState },
    gpaTableState: { ...initialState },
    insertGpaTableState: { ...initialState },
    examSchedState: { ...initialState },
    examSchedTemplateState: { ...initialState },
}

const admissionReducer = (state = initialGeneralState, action) => {
    switch (action.type) {

        //Get Enrollment table
        case FETCH_ENROLLMENTTABLE_REQUEST:
            return { ...state, tableState: { loading: true, data: [], error: '' } };
        case FETCH_ENROLLMENTTABLE_SUCCESS:
            return { ...state, tableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ENROLLMENTTABLE_FAILURE:
            return { ...state, tableState: { loading: false, data: [], error: action.payload } };

        //Fetch Student Data using StudentId
        case FETCH_STUDENTBYID_REQUEST:
            return { ...state, studentDataState: { loading: true, data: [], error: '' } };
        case FETCH_STUDENTBYID_SUCCESS:
            return { ...state, studentDataState: { loading: false, data: action.payload, error: '' } };
        case FETCH_STUDENTBYID_FAILURE:
            return { ...state, studentDataState: { loading: false, data: '', error: action.payload } };

        //insert template form
        case FETCH_INSERTTEMPLATEFORM_REQUEST:
            return { ...state, insertTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTTEMPLATEFORM_SUCCESS:
            return { ...state, insertTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTTEMPLATEFORM_FAILURE:
            return { ...state, insertTemplateState: { loading: false, data: '', error: action.payload } };

        // Level
        case FETCH_LEVEL_REQUEST:
            return { ...state, levelState: { loading: true, data: [], error: '' } };
        case FETCH_LEVEL_SUCCESS:
            return { ...state, levelState: { loading: false, data: action.payload, error: '' } };
        case FETCH_LEVEL_FAILURE:
            return { ...state, levelState: { loading: false, data: [], error: action.payload } };

        // Division
        case FETCH_DIVISION_REQUEST:
            return { ...state, divisionState: { loading: true, data: [], error: '' } };
        case FETCH_DIVISION_SUCCESS:
            return { ...state, divisionState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DIVISION_FAILURE:
            return { ...state, divisionState: { loading: false, data: [], error: action.payload } };

        // Get the template table
        case FETCH_TEMPLATETABLE_REQUEST:
            return { ...state, templateTableState: { loading: true, data: [], error: '' } };
        case FETCH_TEMPLATETABLE_SUCCESS:
            return { ...state, templateTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_TEMPLATETABLE_FAILURE:
            return { ...state, templateTableState: { loading: false, data: [], error: action.payload } };

        // Get the template table
        case FETCH_ROWTEMPLATETABLE_REQUEST:
            return { ...state, rowTemplateTableState: { loading: true, data: [], error: '' } };
        case FETCH_ROWTEMPLATETABLE_SUCCESS:
            return { ...state, rowTemplateTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_ROWTEMPLATETABLE_FAILURE:
            return { ...state, rowTemplateTableState: { loading: false, data: [], error: action.payload } };

            
        //Update the row template
        case FETCH_UPDATEROWTEMPLATE_REQUEST:
            return { ...state, rowUpdateState: { loading: true, data: [], error: '' } };
        case FETCH_UPDATEROWTEMPLATE_SUCCESS:
            return { ...state, rowUpdateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_UPDATEROWTEMPLATE_FAILURE:
            return { ...state, rowUpdateState: { loading: false, data: [], error: action.payload } };

         //Get Document table
        case FETCH_DOCUMENTTABLE_REQUEST:
            return { ...state, documentTableState: { loading: true, data: [], error: '' } };
        case FETCH_DOCUMENTTABLE_SUCCESS:
            return { ...state, documentTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_DOCUMENTTABLE_FAILURE:
            return { ...state, documentTableState: { loading: false, data: [], error: action.payload } };

        //Insert document in table
        case FETCH_INSERTDOCUMENT_REQUEST:
            return { ...state, insertDocumentState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTDOCUMENT_SUCCESS:
            return { ...state, insertDocumentState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTDOCUMENT_FAILURE:
            return { ...state, insertDocumentState: { loading: false, data: [], error: action.payload } };

        //Get Gpa Table by student id
        case FETCH_GPATABLE_REQUEST:
            return { ...state, gpaTableState: { loading: true, data: [], error: '' } };
        case FETCH_GPATABLE_SUCCESS:
            return { ...state, gpaTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_GPATABLE_FAILURE:
            return { ...state, gpaTableState: { loading: false, data: [], error: action.payload } };

        //Get Gpa Table by student id
        case FETCH_INSERTGPATABLE_REQUEST:
            return { ...state, insertGpaTableState: { loading: true, data: [], error: '' } };
        case FETCH_INSERTGPATABLE_SUCCESS:
            return { ...state, insertGpaTableState: { loading: false, data: action.payload, error: '' } };
        case FETCH_INSERTGPATABLE_FAILURE:
            return { ...state, insertGpaTableState: { loading: false, data: [], error: action.payload } };
            
        //Get exam sched by student id
        case FETCH_EXAMINATIONSCHEDULER_REQUEST:
            return { ...state, examSchedState: { loading: true, data: [], error: '' } };
        case FETCH_EXAMINATIONSCHEDULER_SUCCESS:
            return { ...state, examSchedState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMINATIONSCHEDULER_FAILURE:
            return { ...state, examSchedState: { loading: false, data: [], error: action.payload } };

        //Get exam sched template by level id
        case FETCH_EXAMSCHEDTEMPLATE_REQUEST:
            return { ...state, examSchedTemplateState: { loading: true, data: [], error: '' } };
        case FETCH_EXAMSCHEDTEMPLATE_SUCCESS:
            return { ...state, examSchedTemplateState: { loading: false, data: action.payload, error: '' } };
        case FETCH_EXAMSCHEDTEMPLATE_FAILURE:
            return { ...state, examSchedTemplateState: { loading: false, data: [], error: action.payload } };
        
        
        default:
            return state;
    }
}
export default admissionReducer;