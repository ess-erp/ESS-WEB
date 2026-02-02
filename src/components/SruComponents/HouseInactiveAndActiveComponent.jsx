import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import OutlineBlueBtn from "../ButtonsComponents/OutlineBlueBtn";
import SearchableSelect from "../ButtonsComponents/SearchableSelect";
import {
    fetchLevelData,
} from "../../states/AdmissionState/Action";
import {
    fetchCampusData,
} from "../../states/OnlineApplicationState/Action";
import {
    fetchGetHouseNameData,
    fetchInsertHouseNameData,
} from "../../states/SruState/Action";

const HouseInactiveAndActiveComponent = ({ userId, setLevel, setSelection }) => {
    // console.log(setLevelId);
    const dispatch = useDispatch();
    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];
    const [levelList, setLevelList] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const campusState = useSelector((state) => state.online.campusState || {});
    const campus = campusState.data || [];
    const [campusList, setCampusList] = useState([]);
    const [selectedCampus, setSelectedCampus] = useState(null);

    const [houseName, setHouseName] = useState("");
    const [remarks, setRemarks] = useState("");

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [modalSuccessBody, setModalSuccessBody] = useState("");
    useEffect(() => {
        setLevelList(
            (level || []).map(item => ({
                value: item.LevelId,
                label: item.LevelName,
            }))
        );

        setCampusList(
            (campus || []).map(item => ({
                value: item.CampusId,
                label: item.CampusName,
            }))
        );
    }, [level, campus]);

    const [addNewModal, setAddNewModal] = useState(false);
    const openAddNewModal = () => {
        setAddNewModal(true);
        dispatch(fetchLevelData());
        dispatch(fetchCampusData());
    };

    const handleSubmitModal = async () => {

        console.log(selectedLevel);
        const payload = {
            HouseName: houseName,
            LevelId: selectedLevel.value,
            CampusId: selectedCampus.value,
            Remarks: remarks,
            CreatedByUserId: userId,
        };

        const res = await dispatch(fetchInsertHouseNameData(payload));

        if (res.ok) {
            setModalSuccessBody("Done creating a house!");
            setIsSuccessModalOpen(true);
            setTimeout(() => window.location.reload(), 3000);
        }
    };

    const [inactiveHouses, setInactiveHouses] = useState([]);
    const houseTableState = useSelector((state) => state.sru.houseTableState || {});
    const houseTable = houseTableState.data.data || [];
    const houseTotalRows = houseTableState.data.totalRecords || 0;
    const houseLoading = houseTableState.loading || false;
    const [filterHouseText, setHouseFilterText] = useState('');
    const [houseCurrentPage, setHouseCurrentPage] = useState(1);
    const [houseRowsPerPage, setHouseRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchGetHouseNameData(houseCurrentPage, houseRowsPerPage, filterHouseText));
    }, [houseCurrentPage, houseRowsPerPage, filterHouseText, dispatch]);
    useEffect(() => {
        if (houseTable.length == 0) return;
        setInactiveHouses(houseTable);
    }, [houseTable]);

    const inactiveColumns = [
        { name: 'House', selector: row => row.HouseName, sortable: true },
        { name: 'Level', selector: row => row.LevelName, sortable: true },
        { name: 'Campus', selector: row => row.CampusName, sortable: true },
        {
            name: "Action",
            cell: row => (
                <button
                    onClick={() => handleActivate(row)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                    Activate
                </button>
            )
        }
    ];
    const [activeHouses, setActiveHouses] = useState([]);
    const handleActivate = (row) => {
        setActiveHouses(prev => [...prev, row]);

        setInactiveHouses(prev =>
            prev.filter(s => s.HouseId !== row.HouseId)
        );
    };
    const handleSelectHouse = (row) => {
        setLevel(row);
        setSelection(true);
    };
    const handleDeactivate = (row) => {
        setActiveHouses(prev =>
            prev.filter(s => s.HouseId !== row.HouseId)
        );

        setInactiveHouses(prev => [...prev, row]);
        setSelection(false);
    };
    const activeColumns = [
        { name: "House", selector: row => row.HouseName, sortable: true },
        { name: "Level", selector: row => row.LevelName, sortable: true },
        {
            name: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSelectHouse(row)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Add Student
                    </button>
                    <button
                        onClick={() => handleDeactivate(row)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                        Deactivate
                    </button>
                </div>
            )
        }

    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT — Inactive */}
                <div className="bg-white rounded-lg shadow border border-gray-200">

                    <div className="px-4 py-3 border-b bg-red-50 rounded-t-lg flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-red-600">
                                Inactive House
                            </h3>
                            <p className="text-xs text-gray-600">
                                House not yet available for students
                            </p>
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
                                value={filterHouseText}
                                onChange={(e) => {
                                    setHouseFilterText(e.target.value);
                                    setHouseCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-4">

                        <DataTable
                            columns={inactiveColumns}
                            data={inactiveHouses}
                            progressPending={houseLoading}
                            pagination
                            paginationServer
                            paginationTotalRows={houseTotalRows}
                            paginationDefaultPage={houseCurrentPage}
                            onChangePage={(page) => setHouseCurrentPage(page)}
                            onChangeRowsPerPage={(newPerPage, page) => {
                                setHouseRowsPerPage(newPerPage);
                                setHouseCurrentPage(page);
                            }}
                            highlightOnHover
                            responsive
                        />
                    </div>

                </div>

                {/* RIGHT — Active */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="px-4 py-3 border-b bg-green-50 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-green-600">
                            Active Houses
                        </h3>
                        <p className="text-xs text-gray-600">
                            Houses currently open for enrollment
                        </p>
                    </div>

                    <div className="p-4">
                        <DataTable
                            columns={activeColumns}
                            data={activeHouses}
                            pagination
                            highlightOnHover
                            dense
                            responsive
                        />
                    </div>
                </div>
                <ModalComponent
                    isOpen={addNewModal}
                    onClose={() => setAddNewModal(false)}
                    title="Create a new house"
                    body={
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <label className="flex flex-col">
                                <span className="text-sm font-medium mb-1">House Name</span>
                                <input
                                    type="text"
                                    placeholder="Enter House Name"
                                    value={houseName}
                                    onChange={(e) => setHouseName(e.target.value)}
                                    className="w-full rounded-lg border p-2"
                                />
                            </label>
                            <SearchableSelect
                                options={levelList}
                                value={selectedLevel}
                                onChange={(selected) => setSelectedLevel(selected)}
                                placeholder="-- Select Level --"
                                label="Select Level"
                            />

                            <SearchableSelect
                                options={campusList}
                                value={selectedCampus}
                                onChange={(selected) => setSelectedCampus(selected)}
                                placeholder="-- Select Campus --"
                                label="Select Campus"
                            />

                            <label className="flex flex-col">
                                <span className="text-sm font-medium mb-1">Remarks</span>
                                <input
                                    type="text"
                                    placeholder="Enter Remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="w-full rounded-lg border p-2"
                                />
                            </label>

                        </div>
                    }
                    size="w-[600px]"
                    maxHeight="100vh"
                    buttons={[
                        { label: "Submit", type: "green", onClick: handleSubmitModal },
                        { label: "Cancel", type: "red", onClick: () => setAddNewModal(false) },
                    ]}
                />
                <ModalComponent
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    title={<span className="font-bold text-lg text-green-700">Success</span>}
                    body={<p>{modalSuccessBody}</p>}
                />
            </div>
        </>
    );
};

export default HouseInactiveAndActiveComponent;