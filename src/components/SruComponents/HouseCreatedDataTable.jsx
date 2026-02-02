import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import {
    fetchGetStudentHouseListData,
} from "../../states/SruState/Action";

const HouseCrteatedDataTable = () => {
    const dispatch = useDispatch();
    const studentHouseListState = useSelector((state) => state.sru.studentHouseListState || {});
    const studentList = studentHouseListState.data.data || [];
    const studentTableTotalRows = studentHouseListState.data.totalRecords || 0;
    const studentTableLoading = studentHouseListState.loading || false;
    const [filterStudentTableText, setStudentTableFilterText] = useState('');
    const [studentTableCurrentPage, setStudentTableCurrentPage] = useState(1);
    const [studentTableRowsPerPage, setStudentTableRowsPerPage] = useState(10);
    console.log(studentList);
    useEffect(() => {
        dispatch(fetchGetStudentHouseListData(studentTableCurrentPage, studentTableRowsPerPage, filterStudentTableText));
    }, [studentTableCurrentPage, studentTableRowsPerPage, filterStudentTableText, dispatch]);

    const studentColumn = [
        { name: 'Student Number', selector: row => row.StudentNumber, sortable: true },
        { name: 'Fullname', selector: row => `${row.Fname} ${row.Mname ?? ""} ${row.Lname}`, sortable: true },
        { name: 'House', selector: row => row.HouseName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Date Created', selector: row => new Date(row.DateCreated).toLocaleDateString(), sortable: true },
    ];
    return (
        <>
            <div className="p-6 mt-8 bg-white rounded shadow">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-green-700">
                        List of House Created
                    </h2>

                    <div className="flex items-center gap-2">

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-full max-w-xs"
                            value={filterStudentTableText}
                            onChange={(e) => {
                                setStudentTableFilterText(e.target.value);
                                setStudentTableCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                <DataTable
                    columns={studentColumn}
                    data={studentList}
                    progressPending={studentTableLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={studentTableTotalRows}
                    paginationDefaultPage={studentTableCurrentPage}
                    onChangePage={(page) => setStudentTableCurrentPage(page)}
                    onChangeRowsPerPage={(newPerPage, page) => {
                        setStudentTableRowsPerPage(newPerPage);
                        setStudentTableCurrentPage(page);
                    }}
                    highlightOnHover
                    responsive
                />
            </div>
        </>
    );
};

export default HouseCrteatedDataTable;