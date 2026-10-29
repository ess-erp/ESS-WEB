import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaTable, FaCheckCircle } from 'react-icons/fa';
import ModalComponent from "../ButtonsComponents/ModalComponent";
import DataTable from "react-data-table-component";
import {
    fetchEmployeeApplicationInfoData,
    fetchCriteriaTableData,
    fetchSubmitInterviewData,
} from "../../states/SacState/Action";

const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#027407',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    headCells: {
        style: {
            color: '#ffffff',
        },
    },
};

const EmployeeInterviewComponent = ({ employeeAppId, userId }) => {
    const dispatch = useDispatch();
    const [ratings, setRatings] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Redux States
    const employeeData = useSelector(state => state.sac.employeeInfoState?.data || {});
    const criteriaTableState = useSelector(state => state.sac.criteriaTableState || {});
    const criteriaData = criteriaTableState.data?.data || [];
    const criteriaTableLoading = criteriaTableState.loading || false;
    console.log(employeeData);

    // Get first criteria (backend already filters by userId, returns single criteria)
    const sacCriteria = criteriaData[0] || null;
    const criteriaChildList = sacCriteria?.SacCriteriaChildDtos || [];

    // Fetch employee data on mount
    useEffect(() => {
        if (!employeeAppId) return;
        dispatch(fetchEmployeeApplicationInfoData(employeeAppId));
    }, [dispatch, employeeAppId]);

    // Fetch criteria table on mount
    useEffect(() => {
        if (!employeeAppId || !userId) return;
        dispatch(fetchCriteriaTableData(employeeAppId, userId, 1, 100));
    }, [dispatch, employeeAppId, userId]);

    // Initialize ratings from existing data
    useEffect(() => {
        if (!criteriaChildList.length) return;

        const initialRatings = {};
        criteriaChildList.forEach(child => {
            if (child.Rating != null) {
                initialRatings[child.CriteriaChildId] = Number(child.Rating);
            }
        });
        setRatings(initialRatings);
    }, [criteriaChildList]);

    // Handle rating change
    const handleRatingChange = (criteriaChildId, rating) => {
        setRatings(prev => ({
            ...prev,
            [criteriaChildId]: rating
        }));
    };

    // Criteria Table Columns
    const criteriaColumns = [
        {
            name: 'Criteria',
            selector: row => row.CriteriaName,
            sortable: true,
            grow: 2,
        },
        {
            name: 'Poor (1)',
            center: true,
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="1"
                    checked={ratings[row.CriteriaChildId] === 1}
                    onChange={() => handleRatingChange(row.CriteriaChildId, 1)}
                    className="cursor-pointer w-4 h-4"
                />
            )
        },
        {
            name: 'Marginal (2)',
            center: true,
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="2"
                    checked={ratings[row.CriteriaChildId] === 2}
                    onChange={() => handleRatingChange(row.CriteriaChildId, 2)}
                    className="cursor-pointer w-4 h-4"
                />
            )
        },
        {
            name: 'Good (3)',
            center: true,
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="3"
                    checked={ratings[row.CriteriaChildId] === 3}
                    onChange={() => handleRatingChange(row.CriteriaChildId, 3)}
                    className="cursor-pointer w-4 h-4"
                />
            )
        },
        {
            name: 'Excellent (4)',
            center: true,
            cell: (row) => (
                <input
                    type="radio"
                    name={`rating-${row.CriteriaChildId}`}
                    value="4"
                    checked={ratings[row.CriteriaChildId] === 4}
                    onChange={() => handleRatingChange(row.CriteriaChildId, 4)}
                    className="cursor-pointer w-4 h-4"
                />
            )
        },
    ];

    // Handle Submit
    const handleSubmit = () => {
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsModalOpen(false);

        // Build CriteriaRatingDtos
        const CriteriaRatingDtos = [];
        Object.keys(ratings).forEach(criteriaChildId => {
            const rating = ratings[criteriaChildId];
            if (rating) {
                CriteriaRatingDtos.push({
                    CriteriaId: sacCriteria?.CriteriaId,
                    CriteriaChildId: Number(criteriaChildId),
                    Rating: rating
                });
            }
        });

        // Simple Payload
        const payload = {
            EmployeeId: employeeData.EmployeeId,
            EmployeeAppId: employeeData.EmployeeAppId,
            CriteriaRatingDtos: CriteriaRatingDtos,
            CreatedByUserId: userId,
        };

        console.log('Submit Payload:', payload);

        const res = await dispatch(fetchSubmitInterviewData(payload));
        if (res.ok) {
            setIsSuccessModalOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">Employee Interview Process</h3>
                <p className="text-sm mt-1">Application No: {employeeData.EmployeeAppNo}</p>
            </div>

            {/* Applicant Information */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <FaUser className="text-green-600" />
                    <h2 className="text-lg font-bold text-gray-800">Applicant Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee App No</label>
                        <input
                            type="text"
                            value={employeeData.EmployeeAppNo || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={`${employeeData.Fname || ""} ${employeeData.Mname || ""} ${employeeData.Lname || ""}`}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nick Name</label>
                        <input
                            type="text"
                            value={employeeData.Nickname || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desired Position</label>
                        <input
                            type="text"
                            value={employeeData.DesiredPosition || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                        <input
                            type="text"
                            value={employeeData.CampusName || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee Category</label>
                        <input
                            type="text"
                            value={employeeData.EmployeeCategory || ""}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Criteria Rating Table */}
            {sacCriteria && (
                <div className="bg-white rounded-lg shadow">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-gray-200 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <FaTable className="text-indigo-600" />
                            <h2 className="text-lg font-bold text-gray-800">{sacCriteria.CriteriaTempName}</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <DataTable
                            columns={criteriaColumns}
                            data={criteriaChildList}
                            progressPending={criteriaTableLoading}
                            highlightOnHover
                            responsive
                            customStyles={customStyles}
                            noDataComponent={
                                <div className="p-4 text-gray-500">No criteria available</div>
                            }
                        />
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                    <FaCheckCircle />
                    <span>Submit Interview</span>
                </button>
            </div>

            {/* Confirmation Modal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={<span className="font-bold text-lg text-yellow-700">Confirm Submission</span>}
                body="Are you sure you want to submit this interview evaluation?"
                buttons={[
                    { label: "Yes, Submit", type: "green", onClick: handleConfirmSubmit },
                    { label: "Cancel", type: "red", onClick: () => setIsModalOpen(false) },
                ]}
            />

            {/* Success Modal */}
            <ModalComponent
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={<span className="font-bold text-lg text-green-700">Success</span>}
                body="Interview evaluation submitted successfully!"
                buttons={[
                    { label: "OK", type: "green", onClick: () => setIsSuccessModalOpen(false) },
                ]}
            />
        </div>
    );
};

export default EmployeeInterviewComponent;
