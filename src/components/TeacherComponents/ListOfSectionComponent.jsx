import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import RowToggleComponent from "../ButtonsComponents/RowToggleComponent";
import { Pencil, Eye, Trash2, Plus, } from "lucide-react";
import {
    fetchListOfSectionData,
} from "../../states/TeacherState/Action";
import { getFormatDate } from "../../GlobalFunction/FormatDate";
import { getFormatToAMPM } from "../../GlobalFunction/FormatToAMPM";

const ListOfSectionComponent = () => {
    return(
        <div>
            <div className="bg-white rounded-lg shadow border border-gray-200">

                <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-green-600">
                            Faculty Load Master List
                        </h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <OutlineBlueBtn
                            label="Add new"
                            onClick={openAddNewModal}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="px-3 py-2 border border-gray-300 rounded w-64"
                            value={facultyLoadTableSearchFilter}
                            onChange={(e) => {
                                setFacultyLoadTableFilterText(e.target.value);
                                setFacultyCurrentPage(1);
                            }}
                        />
                    </div>

                </div>
                <div className="w-full">
                    <DataTable
                        columns={facultyLoadColumn}
                        data={facultyLoadList}
                        progressPending={facultyLoadLoading}
                        pagination
                        paginationServer
                        paginationTotalRows={facultyLoadTotalRows}
                        paginationDefaultPage={facultyLoadCurrentPage}
                        onChangePage={(page) => setFacultyLoadTableCurrentPage(page)}
                        onChangeRowsPerPage={(newPerPage, page) => {
                            setFacultyLoadTableCurrentPage(newPerPage);
                            setFacultyLoadTableRowsPerPage(page);
                        }}
                        highlightOnHover
                        responsive
                    />
                </div>

            </div>
        </div>
    );
};

export default ListOfSectionComponent;