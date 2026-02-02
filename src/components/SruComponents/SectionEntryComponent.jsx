import { useState } from "react";
import InactiveAndActiveDataTable from "./InactiveAndActiveDataTable";
import SectionCreatedDataTable from "./SectionCreatedDataTable";
import StudentToSectionComponent from "./StudentToSectionComponent";

const SectionEntryComponent = () => {
    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    const [level, setLevel] = useState(null);
    const [selection, setSelection] = useState(false);
   
    return (
        <div>
            <InactiveAndActiveDataTable userId={userId} setLevel={setLevel} setSelection={setSelection} />
            {selection && (
                <>
                    <StudentToSectionComponent level={level} userId={userId} />
                </>
            )}
            <SectionCreatedDataTable />
        </div>
    );
};

export default SectionEntryComponent;