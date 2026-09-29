import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import { Pencil, Eye, Trash2 } from "lucide-react";
import {
    fetchSchoolCalendarTableData,
    fetchSchoolCalendarActivityData,
    fetchInsertSchoolCalendarActivityData,
    fetchUpdateSchoolCalendarData,
    fetchDeleteSchoolCalendarData,
} from "../../states/SruState/Action";
import {
    fetchCampusData,
    fetchDivisionData,
} from "../../states/OnlineApplicationState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";

const SY_LIST = [
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2026-2027", label: "2026-2027" },
];

const TERM_LIST = [
    { value: "Term1", label: "1st Term" },
    { value: "Term2", label: "2nd Term" },
    { value: "Term3", label: "3rd Term" },
];

const EMPTY_FORM = {
    calendarId: null,
    selectedActivity: null,
    selectedCampus: null,
    selectedDivision: null,
    selectedTerm: null,
    selectedSY: null,
    startDate: "",
    endDate: "",
    remarks: "",
};

const SchoolCalendarDataTable = () => {
    const dispatch = useDispatch();
    const formatDate = getFormatDate;

    const [user] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });
    const userId = user?.UserId;

    // ── Table state ─────────────────────────────────────────────────────────
    const schoolCalendarTableState = useSelector((s) => s.sru.schoolCalendarTableState || {});
    const schoolCalendarTable = schoolCalendarTableState.data?.data || [];
    const schoolCalendarTotalRows = schoolCalendarTableState.data?.totalRecords || 0;
    const schoolCalendarLoading = schoolCalendarTableState.loading || false;

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchFilter, setSearchFilter] = useState("");

    useEffect(() => {
        dispatch(fetchSchoolCalendarTableData(currentPage, rowsPerPage, searchFilter));
    }, [currentPage, rowsPerPage, searchFilter, dispatch]);

    // ── Dropdowns from Redux ─────────────────────────────────────────────────
    const campusState = useSelector((s) => s.online.campusState || {});
    const campusList = (campusState.data || []).map((c) => ({ value: c.CampusId, label: c.CampusName }));

    const activityState = useSelector((s) => s.sru.schoolCalendarActivityState || {});
    const activityList = (activityState.data || []).map((a) => ({ value: a.ActId, label: a.ActivityName }));

    const divisionState = useSelector((s) => s.online.divisionState || {});
    const divisionList = (divisionState.data || []).map((d) => ({ value: d.DivId, label: d.DivName }));

    // ── Modal states ────────────────────────────────────────────────────────
    const [addModal, setAddModal]         = useState(false);
    const [editModal, setEditModal]       = useState(false);
    const [viewModal, setViewModal]       = useState(false);
    const [deleteModal, setDeleteModal]   = useState(false);
    const [warningModal, setWarningModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [successMsg, setSuccessMsg]     = useState("");
    const [pendingAction, setPendingAction] = useState(null); // 'add' | 'edit' | 'delete'

    const [form, setForm] = useState(EMPTY_FORM);
    const [selectedRow, setSelectedRow] = useState(null);

    const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    const resetForm = () => setForm(EMPTY_FORM);

    // ── Open modals ─────────────────────────────────────────────────────────
    const openDropdowns = () => {
        dispatch(fetchCampusData());
        dispatch(fetchSchoolCalendarActivityData());
        dispatch(fetchDivisionData());
    };

    const openAddModal = () => {
        openDropdowns();
        resetForm();
        setAddModal(true);
    };

    const openEditModal = (row) => {
        openDropdowns();
        setForm({
            calendarId: row.CalendarId,
            selectedActivity: row.ActId ? { value: row.ActId, label: row.ActivityName } : null,
            selectedCampus:   row.CampusId ? { value: row.CampusId, label: row.CampusName } : null,
            selectedDivision: row.DivId ? { value: row.DivId, label: row.DivName } : null,
            selectedTerm:     row.GradingPeriod ? TERM_LIST.find((t) => t.value === row.GradingPeriod) || null : null,
            selectedSY:       row.SchoolYear ? SY_LIST.find((s) => s.value === row.SchoolYear) || null : null,
            startDate:        row.StartDate ? row.StartDate.substring(0, 10) : "",
            endDate:          row.EndDate   ? row.EndDate.substring(0, 10)   : "",
            remarks:          row.Remarks || "",
        });
        setEditModal(true);
    };

    const openViewModal = (row) => {
        setSelectedRow(row);
        setViewModal(true);
    };

    const openDeleteModal = (row) => {
        setSelectedRow(row);
        setDeleteModal(true);
    };

    // ── Submit handlers ──────────────────────────────────────────────────────
    const handleAddWarning  = () => { setPendingAction("add");    setWarningModal(true); };
    const handleEditWarning = () => { setPendingAction("edit");   setWarningModal(true); };
    const handleDeleteWarning = () => { setPendingAction("delete"); setDeleteModal(false); setWarningModal(true); };

    const handleConfirm = async () => {
        setWarningModal(false);

        if (pendingAction === "add") {
            const payload = {
                ActId:          form.selectedActivity?.value,
                CampusId:       form.selectedCampus?.value,
                DivId:          form.selectedDivision?.value,
                GradingPeriod:  form.selectedTerm?.value,
                SchoolYear:     form.selectedSY?.value,
                StartDate:      form.startDate,
                EndDate:        form.endDate,
                Remarks:        form.remarks,
                CreatedByUserId: userId,
            };
            const res = await dispatch(fetchInsertSchoolCalendarActivityData(payload));
            if (res.ok) {
                setAddModal(false);
                resetForm();
                setSuccessMsg("School Calendar Activity has been added successfully!");
                setSuccessModal(true);
                dispatch(fetchSchoolCalendarTableData(currentPage, rowsPerPage, searchFilter));
            }
        }

        if (pendingAction === "edit") {
            const payload = {
                CalendarId:     form.calendarId,
                ActId:          form.selectedActivity?.value,
                CampusId:       form.selectedCampus?.value,
                DivId:          form.selectedDivision?.value,
                GradingPeriod:  form.selectedTerm?.value,
                SchoolYear:     form.selectedSY?.value,
                StartDate:      form.startDate,
                EndDate:        form.endDate,
                Remarks:        form.remarks,
                UpdatedByUserId: userId,
            };
            const res = await dispatch(fetchUpdateSchoolCalendarData(payload));
            if (res.ok) {
                setEditModal(false);
                resetForm();
                setSuccessMsg("School Calendar Activity has been updated successfully!");
                setSuccessModal(true);
                dispatch(fetchSchoolCalendarTableData(currentPage, rowsPerPage, searchFilter));
            }
        }

        if (pendingAction === "delete") {
            const res = await dispatch(fetchDeleteSchoolCalendarData(selectedRow?.CalendarId));
            if (res.ok) {
                setSuccessMsg("School Calendar Activity has been deleted successfully!");
                setSuccessModal(true);
                dispatch(fetchSchoolCalendarTableData(currentPage, rowsPerPage, searchFilter));
            }
        }
    };

    // ── Columns ──────────────────────────────────────────────────────────────
    const columns = [
        { name: "Activity",          selector: (r) => r.ActivityName,  sortable: true, wrap: true },
        { name: "School Year",       selector: (r) => r.SchoolYear,    sortable: true, width: "120px" },
        { name: "Campus",            selector: (r) => r.CampusName,    sortable: true },
        { name: "Division",          selector: (r) => r.DivName,       sortable: true },
        { name: "Grading Period",    selector: (r) => r.GradingPeriod, sortable: true, width: "130px" },
        { name: "Start Date",        selector: (r) => formatDate(r.StartDate), sortable: true, width: "120px" },
        { name: "End Date",          selector: (r) => formatDate(r.EndDate),   sortable: true, width: "120px" },
        { name: "Remarks",           selector: (r) => r.Remarks,       sortable: true, wrap: true },
        { name: "Date Created",      selector: (r) => formatDate(r.DateCreated), sortable: true, width: "130px" },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2 items-center">
                    <button className="p-1 text-blue-600 hover:text-blue-800"   title="View"   onClick={() => openViewModal(row)}>
                        <Eye size={16} />
                    </button>
                    <button className="p-1 text-yellow-600 hover:text-yellow-800" title="Edit"   onClick={() => openEditModal(row)}>
                        <Pencil size={16} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800"    title="Delete" onClick={() => openDeleteModal(row)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    // ── Shared form body ─────────────────────────────────────────────────────
    const renderForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
                options={activityList}
                value={form.selectedActivity}
                onChange={(v) => setField("selectedActivity", v)}
                placeholder="-- Select School Activity --"
                label="School Activity"
                required
            />
            <SearchableSelect
                options={SY_LIST}
                value={form.selectedSY}
                onChange={(v) => setField("selectedSY", v)}
                placeholder="-- Select School Year --"
                label="School Year"
                required
            />
            <SearchableSelect
                options={campusList}
                value={form.selectedCampus}
                onChange={(v) => setField("selectedCampus", v)}
                placeholder="-- Select Campus --"
                label="Campus"
                required
            />
            <SearchableSelect
                options={divisionList}
                value={form.selectedDivision}
                onChange={(v) => setField("selectedDivision", v)}
                placeholder="-- Select Division --"
                label="Division"
            />
            <SearchableSelect
                options={TERM_LIST}
                value={form.selectedTerm}
                onChange={(v) => setField("selectedTerm", v)}
                placeholder="-- Select Grading Period/Term --"
                label="Grading Period / Term"
            />
            <div />
            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 mb-1"><strong>Start Date</strong></span>
                <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </label>
            <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 mb-1"><strong>End Date</strong></span>
                <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </label>
            <div className="col-span-1 md:col-span-2">
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-1"><strong>Remarks</strong></span>
                    <input
                        type="text"
                        placeholder="Enter Remarks"
                        value={form.remarks}
                        onChange={(e) => setField("remarks", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
            </div>
        </div>
    );

    // ── View body ────────────────────────────────────────────────────────────
    const renderViewRow = (label, value) => (
        <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</span>
        </div>
    );

    return (
        <div>
            {/* ── Table ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-4 py-3 border-b bg-white rounded-t-lg flex items-center justify-between">
                    <h3 className="text-lg font-bold text-green-600">School Calendar Active</h3>
                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn label="Add new" onClick={openAddModal} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64 text-sm"
                            value={searchFilter}
                            onChange={(e) => { setSearchFilter(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={schoolCalendarTable}
                    progressPending={schoolCalendarLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={schoolCalendarTotalRows}
                    paginationDefaultPage={currentPage}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => { setRowsPerPage(newPerPage); setCurrentPage(page); }}
                    highlightOnHover
                    responsive
                />
            </div>

            {/* ── Add Modal ────────────────────────────────────────────── */}
            <ModalComponent
                isOpen={addModal}
                onClose={() => { setAddModal(false); resetForm(); }}
                title="Add School Calendar Activity"
                size="w-[700px]"
                maxHeight="100vh"
                body={renderForm()}
                buttons={[
                    { label: "Submit", type: "green", onClick: handleAddWarning, closeOnClick: false },
                    { label: "Cancel", type: "red",   onClick: () => { setAddModal(false); resetForm(); }, closeOnClick: false },
                ]}
            />

            {/* ── Edit Modal ───────────────────────────────────────────── */}
            <ModalComponent
                isOpen={editModal}
                onClose={() => { setEditModal(false); resetForm(); }}
                title="Edit School Calendar Activity"
                size="w-[700px]"
                maxHeight="100vh"
                body={renderForm()}
                buttons={[
                    { label: "Update", type: "green", onClick: handleEditWarning, closeOnClick: false },
                    { label: "Cancel", type: "red",   onClick: () => { setEditModal(false); resetForm(); }, closeOnClick: false },
                ]}
            />

            {/* ── View Modal ───────────────────────────────────────────── */}
            <ModalComponent
                isOpen={viewModal}
                onClose={() => setViewModal(false)}
                title="School Calendar Activity Details"
                size="w-[600px]"
                maxHeight="100vh"
                body={
                    selectedRow && (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-2">
                            {renderViewRow("Activity",        selectedRow.ActivityName)}
                            {renderViewRow("School Year",     selectedRow.SchoolYear)}
                            {renderViewRow("Campus",          selectedRow.CampusName)}
                            {renderViewRow("Division",        selectedRow.DivName)}
                            {renderViewRow("Grading Period",  selectedRow.GradingPeriod)}
                            {renderViewRow("Start Date",      formatDate(selectedRow.StartDate))}
                            {renderViewRow("End Date",        formatDate(selectedRow.EndDate))}
                            {renderViewRow("Remarks",         selectedRow.Remarks)}
                            {renderViewRow("Date Created",    formatDate(selectedRow.DateCreated))}
                        </div>
                    )
                }
                buttons={[
                    { label: "Close", type: "red", onClick: () => setViewModal(false), closeOnClick: false },
                ]}
            />

            {/* ── Delete Confirm Modal ─────────────────────────────────── */}
            <ModalComponent
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title={<span className="font-bold text-lg text-red-700">Delete Confirmation</span>}
                size="w-[420px]"
                body={
                    <div className="text-center space-y-2 py-2">
                        <div className="flex justify-center mb-2">
                            <Trash2 size={40} className="text-red-500" />
                        </div>
                        <p className="text-gray-700 text-sm">
                            Are you sure you want to delete the activity
                        </p>
                        <p className="text-gray-900 font-bold text-base">
                            "{selectedRow?.ActivityName}"
                        </p>
                        <p className="text-xs text-gray-500">This action cannot be undone.</p>
                    </div>
                }
                buttons={[
                    { label: "Yes, Delete", type: "red",  onClick: handleDeleteWarning, closeOnClick: false },
                    { label: "Cancel",      type: "green", onClick: () => setDeleteModal(false), closeOnClick: false },
                ]}
            />

            {/* ── Warning Modal ────────────────────────────────────────── */}
            <ModalComponent
                isOpen={warningModal}
                onClose={() => setWarningModal(false)}
                title={<span className="font-bold text-lg text-yellow-600">Warning!</span>}
                size="w-[380px]"
                body={
                    <p className="text-sm text-gray-700 py-2">
                        Are you sure you want to {pendingAction === "delete" ? "delete" : pendingAction === "edit" ? "update" : "submit"} this school calendar activity?
                    </p>
                }
                buttons={[
                    { label: "Confirm", type: "green", onClick: handleConfirm,          closeOnClick: false },
                    { label: "Cancel",  type: "red",   onClick: () => setWarningModal(false), closeOnClick: false },
                ]}
            />

            {/* ── Success Modal ────────────────────────────────────────── */}
            <ModalComponent
                isOpen={successModal}
                onClose={() => setSuccessModal(false)}
                title={<span className="font-bold text-lg text-green-700">Success!</span>}
                size="w-[380px]"
                body={<p className="text-sm text-gray-700 py-2">{successMsg}</p>}
                buttons={[
                    { label: "Close", type: "green", onClick: () => setSuccessModal(false), closeOnClick: false },
                ]}
            />
        </div>
    );
};

export default SchoolCalendarDataTable;
