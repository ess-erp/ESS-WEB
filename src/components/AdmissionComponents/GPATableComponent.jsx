import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import DataTable from "react-data-table-component";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
    fetchStudentGpaData,
    fetchStudentUpdatedGpaData,
} from "../../states/AdmissionState/Action";

const GPATableComponent = ({ studentId, levelId }) => {
    console.log("StudentId:", studentId);
    console.log("LevelId:", levelId);
    const dispatch = useDispatch();
    const [subjects, setSubjects] = useState([]);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });


    const updatedGpaState = useSelector((state) => state.admission.updatedGpaState || {});
    const updateGpa = updatedGpaState.data || [];

    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudentUpdatedGpaData(studentId));
        }
    }, [dispatch, studentId]);

    useEffect(() => {
        let newSubjects = [];

        if (levelId >= 1 && levelId <= 3) {
            newSubjects = []; 
        }
        else if (levelId === 5 || levelId >= 6) {
            if (Array.isArray(updateGpa) && updateGpa.length > 0) {
                newSubjects = updateGpa.map((subj) => ({
                    id: subj.SubjId,
                    title: subj.SubjName,
                    score: subj.SubjGrade ?? "",
                }));
            } else {
                newSubjects = [
                    { id: 1, title: "English", score: "" },
                    { id: 2, title: "Math", score: "" },
                    { id: 3, title: "Science", score: "" },
                ];

                if (levelId >= 6) {
                    newSubjects.push(
                        { id: 4, title: "Filipino", score: "" },
                        { id: 5, title: "Araling Panlipunan", score: "" }
                    );
                }
            }
        }

        setSubjects(newSubjects);
    }, [levelId, updateGpa]);




    const [editingRow, setEditingRow] = useState(null);
    const [tempScore, setTempScore] = useState("");

    const handleEditClick = (row) => {
        setEditingRow(row.id);
        setTempScore(row.score);
    };

    const handleSave = (id) => {
        setSubjects((prev) =>
            prev.map((doc) =>
                doc.id === id ? { ...doc, score: tempScore } : doc
            )
        );
        setEditingRow(null);
    };

    const columns = [
        {
            name: "Subject Code",
            selector: (row) => row.title,
            sortable: true,
            wrap: true,
        },
        {
            name: "Grade",
            cell: (row) =>
                editingRow === row.id ? (
                    <input
                        type="text"
                        value={tempScore}
                        onChange={(e) => setTempScore(e.target.value)}
                        onBlur={() => handleSave(row.id)}
                        className="border p-1 rounded w-20"
                        autoFocus
                    />
                ) : (
                    row.score || "—"
                ),
            sortable: true,
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="p-1 text-green-600 hover:text-green-800"
                    onClick={() => handleEditClick(row)}
                >
                    <Pencil size={18} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // submit modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // error modal
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        let errors = [];

        subjects.forEach((subj) => {
            if (subj.score === "" || subj.score === null) {
                errors.push(
                    <div key={subj.id}>
                        Grade for <strong>{subj.title}</strong> cannot be empty
                    </div>
                );
            } else if (isNaN(subj.score)) {
                errors.push(
                    <div key={subj.id}>
                        Grade for <strong>{subj.title}</strong> must be a number
                    </div>
                );
            } else {
                const scoreValue = Number(subj.score);
                if (scoreValue < 0 || scoreValue > 100) {
                    errors.push(
                        <div key={subj.id}>
                            Grade for <strong>{subj.title}</strong> must be between 0 and 100
                        </div>
                    );
                }
            }
        });

        if (errors.length > 0) {
            setErrorMessages(errors); 
            setIsErrorModalOpen(true);
            return;
        }

        // ✅ All good
        console.log("All grades are valid:", subjects);


        const formData = {
            StudentId: studentId,
            CreatedByUserId: user.UserId,
            LevelId: levelId,
            English: subjects[0]?.title || null,
            EnglishGrade: subjects[0]?.score || null,
            Math: subjects[1]?.title || null,
            MathGrade: subjects[1]?.score || null,
            Science: subjects[2]?.title || null,
            ScienceGrade: subjects[2]?.score || null,
            Filipino: subjects[3]?.title || null,
            FilipinoGrade: subjects[3]?.score || null,
            AralingPanlipunan: subjects[4]?.title || null,
            AralingPanlipunanGrade: subjects[4]?.score || null,
        };

        dispatch(fetchStudentGpaData(formData));
        console.log(formData);
        setIsModalOpen(false);
    };
    return (
        <>
            <DataTable
                title={<span className="font-bold text-lg text-green-700">Grade Point Average</span>}
                columns={columns}
                data={subjects}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No subjects for this level"
            />

            {subjects.length > 0 && (
                <div className="flex justify-end mt-4">
                    <GreenBtn label="Submit" onClick={handleOpenModal} />
                </div>
            )}

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
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title={<span className="font-bold text-lg text-red-700">Validation Errors</span>}
                body={
                    <div className="text-left space-y-1">
                        {errorMessages}
                    </div>
                }
                buttons={[
                    { label: "OK", type: "red", onClick: () => setIsErrorModalOpen(false) },
                ]}
            />
        </>
    );
};

export default GPATableComponent;
