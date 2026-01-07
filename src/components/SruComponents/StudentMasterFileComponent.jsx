
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import StudentInfoComponent from "./StudentInfoComponent";
const StudentMasterFileComponent = () => {

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const studentId = query.get("StudentId");
    const [isEditing, setIsEditing] = useState(false);
    return (
        <div>
            <div className="flex items-center mt-2">
                <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
                    Student Information
                </h2>
                <div className="flex-grow">
                    <hr className="border-t border-gray-400" />
                </div>
            </div>
            {/* Student information component start here */}
            <div className="flex justify-end items-end p-2">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isEditing}
                        onChange={() => setIsEditing(!isEditing)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                        rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                        after:transition-all dark:border-gray-600 peer-checked:bg-green-600 relative" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                        {isEditing ? "Editing On" : "Editing Off"}
                    </span>
                </label>
            </div>
            <StudentInfoComponent studentId={studentId} isEditing={isEditing} />
        </div>
    );
};

export default StudentMasterFileComponent;