import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "lucide-react";
import GreenBtn from "../ButtonsComponents/GreenBtn";
import OutlineRedBtn from "../ButtonsComponents/OutlineRedBtn";
import {
  fetchDivisionData,
  fetchLevelData,
} from "../../states/AdmissionState/Action";

const AddNewTemplateComponent = forwardRef(
  ({ rows, setRows, onValidate, templateType, setTemplateType, templateTitle, setTemplateTitle, divId, setDivId }, ref) => {
    const [errors, setErrors] = useState({});


    const dispatch = useDispatch();

    const divisionState = useSelector((state) => state.admission.divisionState || {});
    const division = divisionState.data || [];

    const levelState = useSelector((state) => state.admission.levelState || {});
    const level = levelState.data || [];

    useEffect(() => {
      dispatch(fetchDivisionData());
      dispatch(fetchLevelData());
    }, [dispatch]);

    const handleInputChange = (index, field, value) => {
      const updatedRows = [...rows];
      updatedRows[index][field] = value;
      setRows(updatedRows);
    };


    const addRow = () => {
      let newRow = {};
      if (templateType === "gpa") {
        newRow = { SubjectCode: "", SubjectName: "", DivId: 0, Remarks: "" };
      } else if (templateType === "document") {
        // CHANGED: Removed DocumentTemplate field
        newRow = { DocumentName: "", Remarks: "" };
      }
      //  else if (templateType === "examroom") {
      //   newRow = { RoomNumber: "", RoomName: "", LevelId: 0, DateAvailable: "", Remarks: "" };
      // }
      setRows([...rows, newRow]);
    };

    const removeRow = (index) => {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    };

    // Validation
    const validateForm = () => {
      let newErrors = {};

      if (!templateType.trim()) {
        newErrors.TemplateType = "Template type is required.";
      }
      if (!templateTitle.trim()) {
        newErrors.TemplateTile = "Template Title is required.";
      }

      if (templateType) {
        rows.forEach((row, idx) => {
          if (templateType === "gpa") {
            if (!row.SubjectCode.trim()) {
              newErrors[`SubjectCode_${idx}`] = "Subject Code is required.";
            }
            if (!row.SubjectName.trim()) {
              newErrors[`SubjectName_${idx}`] = "Subject Name is required.";
            }
            if (!divId.trim()) {
              newErrors.DivId = "Division is required.";
            }
            // if (!row.Remarks.trim()) {
            //   newErrors[`Remarks_${idx}`] = "Remarks are required.";
            // }
          }
          if (templateType === "document") {
            if (!row.DocumentName.trim()) {
              newErrors[`DocumentName_${idx}`] = "Document Name is required.";
            }
            // if (!row.Remarks.trim()) {
            //   newErrors[`Remarks_${idx}`] = "Remarks are required.";
            // }
          }
          // if (templateType === "examroom") {
          //   if (!row.RoomNumber.trim()) {
          //     newErrors[`RoomNumber_${idx}`] = "Room Number is required.";
          //   }
          //   if (!row.RoomNumber.trim()) {
          //     newErrors[`RoomName_${idx}`] = "Room Name is required.";
          //   }
          //   if (!row.LevelId) {
          //     newErrors[`LevelId_${idx}`] = "Level is required.";
          //   }
          //   if (!row.DateAvailable.trim()) {
          //     newErrors[`DateAvailable_${idx}`] = "Date Available is required.";
          //   }
          //   // if (!row.Remarks.trim()) {
          //   //   newErrors[`Remarks_${idx}`] = "Remarks are required.";
          //   // }
          // }
        });
      }

      setErrors(newErrors);
      if (onValidate) {
        onValidate(Object.keys(newErrors).length === 0);
      }
    };

    useImperativeHandle(ref, () => ({
      triggerValidation: validateForm,
    }));

    return (
      <div className="max-h-[70vh] overflow-y-auto p-2 space-y-4">
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700">
            Select Template Type
          </label>
          <select
            value={templateType}
            onChange={(e) => {
              const selectedType = e.target.value;
              setTemplateType(selectedType);

              // initialize rows with 1 row immediately
              if (selectedType === "gpa") {
                setRows([{ SubjectCode: "", SubjectName: "", Remarks: "" }]);
              } else if (selectedType === "document") {
                // CHANGED: Removed DocumentTemplate from initial row
                setRows([{ DocumentName: "", Remarks: "" }]);
              } else if (selectedType === "examroom") {
                setRows([{ RoomNumber: "", RoomName: "", LevelId: "", DateAvailable: "", Remarks: "" }]);
              } else {
                setRows([]); // reset if "-- Select Template Type --"
              }
            }}
            onBlur={validateForm}
            className={`mt-1 w-1/2 mx-auto rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 
              ${errors.TemplateType ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">-- Select Template Type --</option>
            <option value="document">List of Document Template</option>
            <option value="gpa">Grade Average Point Template</option>
            {/* <option value="examroom">Examination Room Template</option> */}
          </select>
          {errors.TemplateType && (
            <p className="text-red-500 text-xs mt-1">{errors.TemplateType}</p>
          )}
        </div>

        {templateType && (

          <>
            <div className="text-center mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Template Title
              </label>
              <input
                type="text"
                placeholder="Enter template title"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                onBlur={validateForm}
                className={`mt-1 w-1/2 mx-auto rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 
                ${errors.TemplateTile ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.TemplateTile && (
                <p className="text-red-500 text-xs mt-1">{errors.TemplateTile}</p>
              )}
            </div>
            {/* Division dropdown only when GPA is selected */}
            {templateType === "gpa" && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Division
                </label>
                <select
                  value={divId || ""}
                  onChange={(e) => setDivId(e.target.value)}
                  onBlur={validateForm}
                  className={`mt-1 w-full rounded-lg border p-2 
                ${errors.DivId ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">-- Select Division --</option>
                  {division.map((d) => (
                    <option key={d.DivId} value={d.DivId}>
                      {d.DivName}
                    </option>
                  ))}
                </select>
                {errors.DivId && (
                  <p className="text-red-500 text-xs mt-1">{errors.DivId}</p>
                )}
              </div>
            )}
            {rows.map((row, index) => (
              <div
                key={index}
                className={
                  templateType === "gpa"
                    ? "grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end" // CHANGED: Removed one column for GPA (removed DivId column)
                    : templateType === "document"
                      ? "grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-4 items-end" // CHANGED: Now 2 columns + delete button (Document Name, Remarks)
                      : "grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end" // examroom
                }
              >
                {templateType === "gpa" && (
                  <>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject Code
                      </label>
                      <input
                        type="text"
                        value={row.SubjectCode}
                        onChange={(e) =>
                          handleInputChange(index, "SubjectCode", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`SubjectCode_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`SubjectCode_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`SubjectCode_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        value={row.SubjectName}
                        onChange={(e) =>
                          handleInputChange(index, "SubjectName", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`SubjectName_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`SubjectName_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`SubjectName_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={row.Remarks}
                        onChange={(e) =>
                          handleInputChange(index, "Remarks", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`Remarks_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`Remarks_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`Remarks_${index}`]}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {templateType === "document" && (
                  <>
                    {/* CHANGED: Removed "List of Document Template" dropdown */}
                    {/* Only Document Name and Remarks remain */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={row.DocumentName}
                        onChange={(e) =>
                          handleInputChange(index, "DocumentName", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                        ${errors[`DocumentName_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`DocumentName_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`DocumentName_${index}`]}
                        </p>
                      )}
                    </div>

                    {/* REMOVED: List of Document Template dropdown
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        List of Document Template
                      </label>
                      <select
                        value={row.DocumentTemplate || ""}
                        onChange={(e) =>
                          handleInputChange(index, "DocumentTemplate", e.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
                      >
                        <option value="">-- Select Template --</option>
                        <option value="3pcs1x1">3pcs 1x1</option>
                        <option value="BirthCertificate">Birth Certificate</option>
                        <option value="Baptismal">Baptismal</option>
                        <option value="GoodMoral">Good Moral</option>
                        <option value="PrevReportCard">Previous Report Card</option>
                      </select>
                    </div>
                    */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={row.Remarks}
                        onChange={(e) =>
                          handleInputChange(index, "Remarks", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                        ${errors[`Remarks_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`Remarks_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`Remarks_${index}`]}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {/* {templateType === "examroom" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Room Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter the room number"
                        value={row.RoomNumber}
                        onChange={(e) =>
                          handleInputChange(index, "RoomNumber", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`RoomNumber_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`RoomNumber_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`RoomNumber_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Room Name
                      </label>
                      <input
                        type="text"
                        value={row.RoomName}
                        onChange={(e) =>
                          handleInputChange(index, "RoomName", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`RoomName_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`RoomName_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`RoomName_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <select
                        value={row.LevelId || ""}
                        onChange={(e) =>
                          handleInputChange(index, "LevelId", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                        ${errors[`LevelId_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">-- Select Level --</option>
                        {level.map((d) => (
                          <option key={d.LevelId} value={d.LevelId}>
                            {d.LevelName}
                          </option>
                        ))}
                      </select>
                      {errors[`LevelId_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`LevelId_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date Available
                      </label>
                      <input
                        type="date"
                        value={row.DateAvailable}
                        onChange={(e) =>
                          handleInputChange(index, "DateAvailable", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`DateAvailable_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`DateAvailable_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`DateAvailable_${index}`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remarks
                      </label>
                      <input
                        type="text"
                        value={row.Remarks}
                        onChange={(e) =>
                          handleInputChange(index, "Remarks", e.target.value)
                        }
                        onBlur={validateForm}
                        className={`mt-1 w-full rounded-lg border p-2 
                          ${errors[`Remarks_${index}`] ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors[`Remarks_${index}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`Remarks_${index}`]}
                        </p>
                      )}
                    </div>
                  </>
                )} */}
                {rows.length > 1 && (
                  <OutlineRedBtn
                    icon={<Trash size={14} />}
                    onClick={() => removeRow(index)}
                    width="40px"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <GreenBtn label="Add new row" onClick={addRow} />
            </div>
          </>
        )}
      </div>
    );
  }
);

export default AddNewTemplateComponent;
