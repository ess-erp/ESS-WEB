import { useState, useEffect, useMemo  } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from 'react-data-table-component';
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import GreenBtn from '../ButtonsComponents/GreenBtn';
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchExamRawScoreTableData,
    fetchInsertRawScoreByStudentIdData,
    // fetchRawScoreByStudentData,

} from "../../states/CfwState/Action";

const ExaminationResultComponent = ({ AppId }) => {

    const dispatch = useDispatch();

    const user = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // const rawScoreStudentState = useSelector((state) => state.cfw.rawScoreStudentState || {});
    // const rawScoreStudentData = rawScoreStudentState.data || [];

    // console.log(rawScoreStudentData);

    // useEffect(() => {
    //     dispatch(fetchRawScoreByStudentData(studentId));
    // },[dispatch, studentId]);


    const [isEditable, setIsEditable] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loadingTable, setLoadingTable] = useState(false);
    const [table, setTable] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const fetchTemplates = async (AppId, page = 1, pageSize = 10) => {
        setLoadingTable(true);

        const result = await dispatch(fetchExamRawScoreTableData(AppId, page, pageSize));

        if (result.ok) {
            setTable(result.data);
            setTotalRecords(result.totalRecords || 0);
        } else {
            console.error("Failed to fetch table data:", result.error);
            setTable([]);
        }

        setLoadingTable(false);
    };

    useEffect(() => {
        fetchTemplates(AppId, page, pageSize);
    }, [AppId, page, pageSize, dispatch]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage, newPage) => {
        setPageSize(newPerPage);
        setPage(newPage);
    };

    const column = [
        { name: "Subject Code", selector: (row) => row.SubjectCode || "—", wrap: true },
        { name: "Subject Name", selector: (row) => row.SubjectName || "—", wrap: true },
        { name: "Number of Item", selector: (row) => row.NumberOfItems || "—", wrap: true },
        {
            name: "Raw Score",
            cell: (row) => (
                <input
                    type="number"
                    min="0"
                    // className="border-0 border-b border-gray-400 focus:border-blue-600 focus:ring-0 bg-transparent w-24 text-center outline-none"
                    className={`border-0 border-b w-24 text-center outline-none bg-transparent
                                  ${!isEditable ? "text-gray-400 border-gray-300" : "border-gray-400"}
                              `}
                    value={row.RawScore || ""}
                    onChange={(e) => handleRawScoreChange(row, e.target.value)}
                    disabled={!isEditable}
                />
            ),
            ignoreRowClick: true,
            center: true,
        },
        { name: "Total Score", selector: (row) => row.TotalScore || "—", wrap: true },
        { name: "Equivalent Grade", selector: (row) => row.EquivalentGrade || "—", wrap: true },
    ];
    // const column = useMemo(() => [
    //     { name: "Subject Code", selector: row => row.SubjectCode || "—", wrap: true },
    //     { name: "Subject Name", selector: row => row.SubjectName || "—", wrap: true },
    //     { name: "Number of Item", selector: row => row.NumberOfItems || "—", wrap: true },

    //     {
    //         name: "Raw Score",
    //         cell: (row) => (
    //             <input
    //                 type="number"
    //                 min="0"
    //                 value={row.RawScore || ""}
    //                 onChange={(e) => handleRawScoreChange(row, e.target.value)}
    //                 disabled={isEditable}
    //                 className={`border-0 border-b w-24 text-center outline-none bg-transparent
    //                 ${isEditable ? "text-gray-400 border-gray-300" : "border-gray-400"}
    //             `}
    //             />
    //         ),
    //         ignoreRowClick: true,
    //         center: true,
    //     },
    // ], [isEditable]);

    const handleRawScoreChange = (row, value) => {
        const updated = table.map(r =>
            r.GenSubChildId === row.GenSubChildId
                ? { ...r, RawScore: value }
                : r
        );

        setTable(updated);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);


    const handleOpenModal = () => {
        console.log("TEST");
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {

        setIsLoadingModalOpen(true);

        const payload = {

            ExamCodeId: table[0]?.ExamCodeId,
            AppId: AppId,
            CreatedByUserId: user[0]?.UserId, // since user = useState(...)
            InsertRawScoreChildDtos: table.map(item => ({
                GenSubChildId: item.GenSubChildId,
                RawScore: item.RawScore || "0"
            }))
        };
        const res = await dispatch(fetchInsertRawScoreByStudentIdData(payload));
        if (res.ok) {
            setIsLoadingModalOpen(false);
            setIsSuccessModalOpen(true);
            if (isSuccessModalOpen == false) {
                setTimeout(() => window.location.reload(), 3000);
            }

        }
        else {
            setIsLoadingModalOpen(false);
            setIsErrorModalOpen(true);
        }

        console.log("PAYLOAD:", payload);
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6 w-full">

                <h2 className="text-2xl font-bold text-green-700">
                    Examination Result
                </h2>

                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-gray-600">Enable Edit</span>
                        <RowToggleComponent
                            row={{ isActive: isEditable }}
                            onToggle={(row, newStatus) => setIsEditable(newStatus)}
                        />
                    </div>
                </div>

            </div>
            <DataTable
                columns={column}
                data={table}
                progressPending={loadingTable}
                pagination
                paginationServer
                paginationTotalRows={totalRecords}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                highlightOnHover
                striped
                responsive
            />
            {isEditable && (
                <div className="flex justify-end mt-4">
                    <GreenBtn label="Save" onClick={handleOpenModal} />
                </div>
            )}
            {/* Modals */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Warning</span>}
                body="Are you sure you want to submit?"
                buttons={[
                    { label: "Yes", type: "green", onClick: handleSubmit },
                    { label: "No", type: "red" },
                ]}
            />
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body="Exam schedule has been successfully submit! Test permit was sent to parent emails."
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Error</span>}
                body={"Something went wrong. Please try again."}
                buttons={[
                    { label: "Close", type: "red", onClick: () => setIsErrorModalOpen(false) }
                ]}
            />
            <ModalComponent
                isOpen={isLoadingModalOpen}
                onClose={() => { }} // prevent closing while loading
                title={<span className="font-bold text-lg text-blue-700">Processing</span>}
                body={
                    <div className="flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-gray-600">Saving examination result.</span>
                        <span className="text-gray-600">Please wait don't close this window.</span>
                    </div>
                }
                buttons={[]}
            />
        </div>
    );
};
export default ExaminationResultComponent;