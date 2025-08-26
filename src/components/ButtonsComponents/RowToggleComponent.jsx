import { useEffect, useState } from "react";
const RowToggleComponent = ({ row, onToggle }) => {
    const [isActive, setIsActive] = useState(row.isActive);

    useEffect(() => {
        setIsActive(row.isActive); // sync when parent updates
    }, [row.isActive]);

    const handleChange = () => {
        const newStatus = !isActive;
        setIsActive(newStatus); // animate locally
        onToggle(row, newStatus);
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isActive}
                onChange={handleChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? 'translate-x-5' : ''}`}></div>
        </label>
    );
};

export default RowToggleComponent;