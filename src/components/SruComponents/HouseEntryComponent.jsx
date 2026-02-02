import { useState } from "react";
import HouseInactiveAndActiveComponent from "./HouseInactiveAndActiveComponent";
import StudentToHouseComponent from "./StudentToHouseComponent";
import HouseCrteatedDataTable from "./HouseCreatedDataTable";

const HouseEntryComponent = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const [level, setLevel] = useState(null);
    const [selection, setSelection] = useState(false);
   
    return (
        <div>
            <HouseInactiveAndActiveComponent userId={userId} setLevel={setLevel} setSelection={setSelection} />
            {selection && (
                <>
                    <StudentToHouseComponent level={level} userId={userId} />
                </>
            )}
            <HouseCrteatedDataTable />
        </div>
    );
};

export default HouseEntryComponent;