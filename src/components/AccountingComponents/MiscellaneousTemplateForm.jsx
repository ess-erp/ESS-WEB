import { Plus, Trash2 } from "lucide-react";
import useTemplateStore from "../../zustands/AccountingZustands/useTemplateStore";

const MiscellaneousTemplateForm = () => {
    const {
        miscForm,
        setMiscFormField,
        addMiscRow,
        deleteMiscRow,
        updateMiscRow,
        updateMiscAmount,
        errors,
    } = useTemplateStore();

    // Grade levels matching your image
    const gradeLevels = [
        "Toddler",
        "Nursery",
        "Kinder",
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10",
        "Grade 11",
        "Grade 12",
    ];

    const handleAmountChange = (rowIndex, level, value) => {
        // Allow only numbers and decimals
        const numValue = value.replace(/[^\d.]/g, "");
        updateMiscAmount(rowIndex, level, numValue);
    };

    return (
        <div className="space-y-6">
            {/* Header Information */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-4">
                    Miscellaneous Fees Template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Template Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Template Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={miscForm.tempName}
                            onChange={(e) =>
                                setMiscFormField("tempName", e.target.value)
                            }
                            placeholder="e.g., Student and Miscellaneous Fees"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors["miscTempName"]
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors["miscTempName"] && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors["miscTempName"]}
                            </p>
                        )}
                    </div>

                    {/* School Year */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            School Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={miscForm.schoolYear}
                            onChange={(e) =>
                                setMiscFormField("schoolYear", e.target.value)
                            }
                            placeholder="e.g., 2026 - 2027"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                errors["miscSchoolYear"]
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors["miscSchoolYear"] && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors["miscSchoolYear"]}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Fee Items Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
                    <h4 className="text-white font-bold text-base">Fee Items</h4>
                    <button
                        type="button"
                        onClick={addMiscRow}
                        className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                    >
                        <Plus size={16} />
                        Add Fee Item
                    </button>
                </div>

                {/* Scrollable Table Container */}
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-gray-100 sticky left-0 z-20 min-w-[250px]">
                                    Fee Name
                                </th>
                                {gradeLevels.map((level) => (
                                    <th
                                        key={level}
                                        className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px]"
                                    >
                                        {level}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider sticky right-0 z-20 bg-gray-100 min-w-[80px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {miscForm.rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={gradeLevels.length + 2}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Plus size={48} className="mb-3 opacity-50" />
                                            <p className="text-sm font-medium">
                                                No fee items added yet
                                            </p>
                                            <p className="text-xs mt-1">
                                                Click "Add Fee Item" to get started
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                miscForm.rows.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        {/* Fee Name Column - Sticky */}
                                        <td className="px-4 py-3 border-r border-gray-200 bg-white sticky left-0 z-10">
                                            <input
                                                type="text"
                                                value={row.feeName}
                                                onChange={(e) =>
                                                    updateMiscRow(
                                                        rowIndex,
                                                        "feeName",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter fee name"
                                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                    errors[`miscFeeName-${rowIndex}`]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[`miscFeeName-${rowIndex}`] && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Required
                                                </p>
                                            )}
                                        </td>

                                        {/* Amount Columns for each Grade Level */}
                                        {gradeLevels.map((level) => (
                                            <td
                                                key={level}
                                                className="px-4 py-3 text-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={row.amounts?.[level] || ""}
                                                    onChange={(e) =>
                                                        handleAmountChange(
                                                            rowIndex,
                                                            level,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </td>
                                        ))}

                                        {/* Actions Column - Sticky */}
                                        <td className="px-4 py-3 text-center sticky right-0 z-10 bg-white border-l border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => deleteMiscRow(rowIndex)}
                                                disabled={miscForm.rows.length === 1}
                                                className={`p-2 rounded-lg transition ${
                                                    miscForm.rows.length === 1
                                                        ? "text-gray-300 cursor-not-allowed"
                                                        : "text-red-600 hover:bg-red-50"
                                                }`}
                                                title="Delete row"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer with Row Count */}
                {miscForm.rows.length > 0 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">{miscForm.rows.length}</span>{" "}
                            fee item{miscForm.rows.length !== 1 ? "s" : ""} added
                        </p>
                    </div>
                )}

                {/* Validation Error */}
                {errors["miscRows"] && (
                    <div className="bg-red-50 px-6 py-3 border-t border-red-200">
                        <p className="text-sm text-red-600 font-medium">
                            {errors["miscRows"]}
                        </p>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-bold text-blue-900 mb-2">
                    📋 Instructions:
                </h5>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                        Enter a descriptive template name (e.g., "Student and
                        Miscellaneous Fees")
                    </li>
                    <li>Specify the school year this template applies to</li>
                    <li>
                        Add fee items using the "Add Fee Item" button
                    </li>
                    <li>
                        Enter the fee name and amounts for each grade level
                    </li>
                    <li>
                        Leave amount fields empty (0.00) if a fee doesn't apply to a
                        particular grade level
                    </li>
                    <li>
                        Use the delete button to remove unwanted fee items
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MiscellaneousTemplateForm;
