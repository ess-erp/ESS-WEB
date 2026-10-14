import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Pencil, Eye, FileText, User } from "lucide-react";
import DataTable from 'react-data-table-component';
import RHFListbox from "../ButtonsComponents/RHFListbox";
import InputField from "../ButtonsComponents/InputField";
import ModalComponent from "../ButtonsComponents/ModalComponent";
import {
  fetchCampusData,
  fetchDivisionData,
  fetchLevelData,
  fetchStrandData,
  fetchNationalityData,
  fetchReligionData,
  fetchProvinceData,
  fetchCityData,
  fetchBarangayData,
} from "../../states/OnlineApplicationState/Action";
// import {
//     fetchStudentByIdData,
//     fetchUpdateStudentInfoData,
// } from "../../states/AdmissionState/Action";
import {
  fetchStudentByIdData,
  fetchUpdateStudentFormData,
  fetchInsertStudentEnrollmentData,
} from "../../states/ParentState/Action";
import { fetchOthersTableData, fetchTestPermitData, fetchAdmissionTestResultData, fetchGeneratedLetterData } from "../../states/AdmissionState/Action";
import {
  getFormatDate,
  getDateInputValue,
} from "../../GlobalFunction/FormatDate";

const ApplicationFormComponent = ({ isEditing, appId, userId }) => {
  console.log(appId);
  const dispatch = useDispatch();
  const formatDate = getFormatDate;
  const toDateInputValue = getDateInputValue;

  const { register, handleSubmit, reset, control, watch } = useForm({
    mode: "onSubmit",
    defaultValues: {
      AppId: "",
      AppNumber: "",
      Lrn: "",
      Fname: "",
      Mname: "",
      Lname: "",
      Gender: "",
      DateOfBirth: "",
      PlaceOfBirth: "",
      Campus: null,
      Division: null,
      Level: null,
      Strand: null,
      Nationality: null,
      Religion: null,
      Province: null,
      City: null,
      Barangay: null,
      HomeStreet: "",
      StudentType: "",
      // FathersEmail: "",
      FathersFname: "",
      FathersMname: "",
      FathersLname: "",
      FathersMobileNo: "",
      FathersOccupation: "",
      // MothersEmail: "",
      MothersFname: "",
      MothersMname: "",
      MothersLname: "",
      MothersMobileNo: "",
      MothersOccupation: "",
      ContactPerson: "",
      ContactEmail: "",
      Relationship: "",
    },
  });

  // const studentData = useSelector(state => state.admission.studentDataState?.data || {});
  const studentData = useSelector(
    (state) => state.parent.studentDataState?.data || {},
  );
  // console.log("STUDENT DATA:", studentData);
  const campusList = useSelector(
    (state) => state.online.campusState?.data || [],
  );
  // console.log("Campus List:", campusList);
  const divisionList = useSelector(
    (state) => state.online.divisionState?.data || [],
  );
  const levelList = useSelector((state) => state.online.levelState?.data || []);
  const strandList = useSelector(
    (state) => state.online.strandState?.data || [],
  );
  const nationalityList = useSelector(
    (state) => state.online.nationalityState?.data || [],
  );
  const religionList = useSelector(
    (state) => state.online.religionState?.data || [],
  );
  const provinceList = useSelector(
    (state) => state.online.provinceState?.data || [],
  );
  const cityList = useSelector((state) => state.online.cityState?.data || []);
  const brgyList = useSelector(
    (state) => state.online.barangayState?.data || [],
  );

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    // dispatch(fetchStudentByIdData(appId));
    dispatch(fetchStudentByIdData(appId));
    dispatch(fetchCampusData());
    dispatch(fetchDivisionData());
    dispatch(fetchNationalityData());
    dispatch(fetchReligionData());
    dispatch(fetchProvinceData());
  }, [dispatch, appId]);

  useEffect(() => {
    if (!studentData || !isEditing) return;

    reset({
      AppId: studentData.AppId ?? "",
      AppNumber: studentData.AppNumber ?? "",
      Lrn: studentData.Lrn ?? "",
      Fname: studentData.Fname ?? "",
      Mname: studentData.Mname ?? "",
      Lname: studentData.Lname ?? "",
      Gender: studentData.Gender ?? "",
      DateOfBirth: toDateInputValue(studentData.DateOfBirth) ?? null,
      PlaceOfBirth: studentData.PlaceOfBirth ?? "",
      HomeStreet: studentData.HomeStreet ?? "",
      StudentType: studentData.StudentType ?? "",
      // FathersEmail: studentData.FathersEmail ?? "",
      FathersFname: studentData.FathersFname ?? "",
      FathersMname: studentData.FathersMname ?? "",
      FathersLname: studentData.FathersLname ?? "",
      FathersMobileNo: studentData.FathersMobileNo ?? "",
      FathersOccupation: studentData.FathersOccupation ?? "",
      // MothersEmail: studentData.MothersEmail ?? "",
      MothersFname: studentData.MothersFname ?? "",
      MothersMname: studentData.MothersMname ?? "",
      MothersLname: studentData.MothersLname ?? "",
      MothersMobileNo: studentData.MothersMobileNo ?? "",
      MothersOccupation: studentData.MothersOccupation ?? "",
      ContactPerson: studentData.ContactPerson ?? "",
      ContactEmail: studentData.ContactEmail ?? "",
      Relationship: studentData.Relationship ?? "",
      Campus: null,
      Division: null,
      Level: null,
      Strand: null,
      Nationality: null,
      Religion: null,
      Province: null,
      City: null,
      Barangay: null,
    });
  }, [studentData, isEditing, reset]);

  useEffect(() => {
    if (!isEditing || !studentData?.CampusName || !campusList.length) return;

    const campus = campusList.find(
      (c) => c.CampusName === studentData.CampusName,
    );

    if (campus) {
      reset((prev) => ({ ...prev, Campus: campus }));
    }
  }, [campusList, studentData?.CampusName, isEditing]);
  useEffect(() => {
    if (!isEditing || !studentData?.DivName || !divisionList.length) return;

    const division = divisionList.find(
      (d) => d.DivName === studentData.DivName,
    );

    if (division) {
      reset((prev) => ({ ...prev, Division: division }));
    }
  }, [divisionList, studentData?.DivName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.LevelName || !levelList.length) return;

    const level = levelList.find((l) => l.LevelName === studentData.LevelName);

    if (level) {
      reset((prev) => ({ ...prev, Level: level }));
    }
  }, [levelList, studentData?.LevelName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.NationalityName || !nationalityList.length)
      return;

    const nationality = nationalityList.find(
      (n) => n.NationalityName === studentData.NationalityName,
    );

    if (nationality) {
      reset((prev) => ({ ...prev, Nationality: nationality }));
    }
  }, [nationalityList, studentData?.NationalityName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.ReligionName || !religionList.length)
      return;

    const religion = religionList.find(
      (r) => r.ReligionName === studentData.ReligionName,
    );

    if (religion) {
      reset((prev) => ({ ...prev, Religion: religion }));
    }
  }, [religionList, studentData?.ReligionName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.ProvinceName || !provinceList.length)
      return;

    const province = provinceList.find(
      (r) => r.province_name === studentData.ProvinceName,
    );

    if (province) {
      reset((prev) => ({ ...prev, Province: province }));
    }
  }, [provinceList, studentData?.ProvinceName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.CityName || !cityList.length) return;

    const city = cityList.find((r) => r.city_name === studentData.CityName);

    if (city) {
      reset((prev) => ({ ...prev, City: city }));
    }
  }, [cityList, studentData?.CityName, isEditing]);

  useEffect(() => {
    if (!isEditing || !studentData?.BrgyName || !brgyList.length) return;

    const brgy = brgyList.find((r) => r.brgy_name === studentData.BrgyName);

    if (brgy) {
      reset((prev) => ({ ...prev, Barangay: brgy }));
    }
  }, [brgyList, studentData?.BrgyName, isEditing]);

  const division = watch("Division");
  const level = watch("Level");
  const province = watch("Province");
  const city = watch("City");

  useEffect(() => {
    if (!division?.DivId) return;
    dispatch(fetchLevelData(division.DivId));
  }, [division?.DivId]);

  useEffect(() => {
    if (level?.LevelId !== 15) return;
    dispatch(fetchStrandData(level.LevelId));
  }, [level?.LevelId]);

  useEffect(() => {
    if (!province?.province_code) return;
    dispatch(fetchCityData(province.province_code));
  }, [province?.province_code]);

  useEffect(() => {
    if (!city?.city_code) return;
    dispatch(fetchBarangayData(city.city_code));
  }, [city?.city_code]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isSuccessEnrollOpen, setIsSuccessEnrollOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formType, SetFormType] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState("info");
  
  // Documents table state
  const baseUrl = import.meta.env.VITE_FILE_URL;
  const othersTableState = useSelector((state) => state.admission.othersTableState || {});
  const documents = othersTableState.data?.data || [];
  const totalRows = othersTableState.data?.totalRecords || 0;
  const loadingDocs = othersTableState.loading || false;
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  console.log(othersTableState);
  // Static templates for parents to view
  const staticTemplates = [
    { TempName: "Test Permit", DateCreated: null, ActiveStatus: "Pending" },
    { TempName: "Admission Test Result", DateCreated: null, ActiveStatus: "Pending" },
    { TempName: "Letter", DateCreated: null, ActiveStatus: "Pending" },
  ];
  
  // Combine static templates with API data
  const combinedData = [
    ...staticTemplates.filter(staticRow =>
      !documents.some(apiRow => apiRow.TempName === staticRow.TempName)
    ),
    ...documents
  ];
  
  // Document modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({ name: "", pdf: "" });
  const testPermitState = useSelector((state) => state.admission.testPermitState);
  const { loading: permitLoading, data: permitData } = testPermitState || {};

  const onSubmit = (data, typeOfForm) => {
    setFormData(data);
    // setIsModalOpen(true);
    SetFormType(typeOfForm);

      if (typeOfForm === "enroll") {
      setIsEnrollOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };
  
  // Fetch templates/documents on component mount using appId
  useEffect(() => {
    if (appId) {
      dispatch(fetchOthersTableData(appId, page, pageSize, search));
    }
  }, [dispatch, appId, page, pageSize, search]);
  
  // Document handlers
  const openViewModal = (row) => {
    console.log(`Open view modal for:`, row);
    
    switch (row.TempName) {
      case "Test Permit":
        dispatch(fetchTestPermitData(row.OthersTableId));
        setSelectedDoc({ name: "Test Permit", type: "test-permit" });
        setIsViewModalOpen(true);
        break;
      case "Admission Test Result":
        dispatch(fetchAdmissionTestResultData(row.OthersTableId));
        setSelectedDoc({ name: "Admission Test Result", type: "admission-result" });
        setIsViewModalOpen(true);
        break;
      case "Letter":
        dispatch(fetchGeneratedLetterData(row.OthersTableId));
        setSelectedDoc({ name: "Letter", type: "letter" });
        setIsViewModalOpen(true);
        break;
      default:
        alert("This document is not yet available.");
    }
  };
  
  // DataTable columns
  const columns = [
    {
      name: "Document",
      selector: row => row.TempName,
      sortable: true,
      wrap: true,
      minWidth: "250px"
    },
    {
      name: "Date Created",
      selector: row => row.DateCreated
        ? new Date(row.DateCreated).toLocaleDateString()
        : "—",
      sortable: true,
      width: "150px"
    },
    {
      name: "Status",
      selector: row => row.ActiveStatus,
      sortable: true,
      width: "120px"
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2 justify-end w-full">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            onClick={() => openViewModal(row)}
            title="View Document"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      right: true,
      width: "100px"
    }
  ];

  // Custom loader
  const Loader = () => (
    <div className="flex justify-center items-center py-10">
      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>
  );

    
  const handleConfirmSubmit = async () => {
    if (formType === "enroll") {
        const selectedCampus = campusList.find(
          (c) => c.CampusId === formData?.Campus?.CampusId
      );

      const enrollPayload = {
        AppId: studentData?.AppId || formData?.AppId,
        // CampusId: formData?.Campus?.CampusId || studentData?.CampusId,
        CampusId:
          formData?.Campus?.CampusId ||
          selectedCampus?.CampusId ||
          studentData?.CampusId,
      };

      const enrollRes = await dispatch(
        fetchInsertStudentEnrollmentData(enrollPayload),
      );

      if (enrollRes.ok) {
        setIsSuccessEnrollOpen(true);
        if (isSuccessEnrollOpen == false) {
          // setTimeout(() => window.location.reload(), 3000);
        }
      }
    } else {
      if (!formData) return;

      const {
        Campus,
        Division,
        Level,
        Strand,
        Nationality,
        Religion,
        Province,
        City,
        Barangay,
        ...rest
      } = formData;

      const payload = {
        ...rest,
        CampusId: formData.Campus?.CampusId,
        CampusName: "",
        DivId: formData.Division?.DivId,
        DivName: "",
        LevelId: formData.Level?.LevelId,
        LevelName: "",
        StrandId: formData.Strand?.StrandId ?? null,
        StrandName: null,
        NationalityId: formData.Nationality?.NationalityId,
        NationalityName: "",
        ReligionId: formData.Religion?.ReligionId,
        ReligionName: "",
        ProvinceCode: formData.Province?.province_code,
        ProvinceName: formData.Province?.province_name,
        CityCode: formData.City?.city_code,
        CityName: formData.City?.city_name,
        BrgyCode: formData.Barangay?.brgy_code,
        BrgyName: formData.Barangay?.brgy_name,
        ModifiedByUserId: userId,
      };

      console.log("SUBMIT PAYLOAD:", payload);

      const res = await dispatch(fetchUpdateStudentFormData(payload));
      if (res.ok) {
        setIsSuccessModalOpen(true);
        if (isSuccessModalOpen == false) {
          setTimeout(() => window.location.reload(), 3000);
        }
      }
      console.log("FORM Data:", formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Information Form - Always Visible */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
          <InputField
            name="AppNumber"
            label="Application Number"
            register={register}
            isEditing={false}
            displayValue={studentData.AppNumber}
          />
          <InputField
            name="Lrn"
            label="LRN"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.Lrn}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 items-end w-full">
          <InputField
            name="Fname"
            label="First Name"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.Fname}
          />
          <InputField
            name="Mname"
            label="Middle Name"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.Mname}
          />
          <InputField
            name="Lname"
            label="Last Name"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.Lname}
          />
          <InputField
            name="Gender"
            label="Gender"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.Gender}
          />
          <InputField
            name="DateOfBirth"
            label="Date of birth"
            register={register}
            isEditing={isEditing}
            displayValue={
              isEditing
                ? toDateInputValue(studentData.DateOfBirth)
                : formatDate(studentData.DateOfBirth)
            }
            {...(isEditing ? { type: "date" } : {})}
          />
          <InputField
            name="PlaceOfBirth"
            label="Place of birth"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.PlaceOfBirth}
          />

          <RHFListbox
            name="Campus"
            control={control}
            list={campusList}
            label="Campus"
            labelKey="CampusName"
            isEditing={!isEditing}
            displayValue={studentData.CampusName}
          />
          <RHFListbox
            name="Division"
            control={control}
            list={divisionList}
            label="Division"
            labelKey="DivName"
            isEditing={!isEditing}
            displayValue={studentData.DivName}
          />
          <RHFListbox
            name="Level"
            control={control}
            list={levelList}
            label="Level"
            labelKey="LevelName"
            isEditing={!isEditing}
            displayValue={studentData.LevelName}
          />

          {level?.LevelId === 15 && (
            <RHFListbox
              name="Strand"
              control={control}
              list={strandList}
              label="Strand"
              labelKey="StrandName"
              isEditing={!isEditing}
              displayValue={studentData.StrandName}
            />
          )}

          <RHFListbox
            name="Nationality"
            control={control}
            list={nationalityList}
            label="Nationality"
            labelKey="NationalityName"
            isEditing={!isEditing}
            displayValue={studentData.NationalityName}
          />
          <RHFListbox
            name="Religion"
            control={control}
            list={religionList}
            label="Religion"
            labelKey="ReligionName"
            isEditing={!isEditing}
            displayValue={studentData.ReligionName}
          />
          <RHFListbox
            name="Province"
            control={control}
            list={provinceList}
            label="Province"
            labelKey="province_name"
            isEditing={!isEditing}
            displayValue={studentData.ProvinceName}
          />
          <RHFListbox
            name="City"
            control={control}
            list={cityList}
            label="City"
            labelKey="city_name"
            isEditing={!isEditing}
            displayValue={studentData.CityName}
          />
          <RHFListbox
            name="Barangay"
            control={control}
            list={brgyList}
            label="Barangay"
            labelKey="brgy_name"
            isEditing={!isEditing}
            displayValue={studentData.BrgyName}
          />
          <InputField
            name="HomeStreet"
            label="Home Street No."
            register={register}
            isEditing={isEditing}
            displayValue={studentData.HomeStreet}
          />
          <InputField
            name="StudentType"
            label="Student Type"
            register={register}
            isEditing={isEditing}
            displayValue={studentData.StudentType}
          />
        </div>
      </div>
      <div className="flex items-center pt-4">
        <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
          Parents Information
        </h2>
        <div className="flex-grow">
          <hr className="border-t border-gray-400" />
        </div>
      </div>
      <div className="flex items-center pt-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
          i
        </div>

        <h2 className="text-l font-bold text-green-700 whitespace-nowrap">
          Father's Information
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4">
        <InputField
          name="FathersFname"
          label="First Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.FathersFname}
        />
        <InputField
          name="FathersMname"
          label="Middle Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.FathersMname}
        />
        <InputField
          name="FathersLname"
          label="Last Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.FathersLname}
        />
        {/* <InputField name="FathersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.FathersEmail} /> */}
        <InputField
          name="FathersMobileNo"
          label="Mobile Phone No."
          register={register}
          isEditing={isEditing}
          displayValue={studentData.FathersMobileNo}
        />
        <InputField
          name="FathersOccupation"
          label="Occupation"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.FathersOccupation}
        />
      </div>
      <div className="flex items-center pt-4">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold mr-2">
          i
        </div>

        <h2 className="text-l font-bold text-green-700 whitespace-nowrap">
          Mother's Information
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-4">
        <InputField
          name="MothersFname"
          label="First Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.MothersFname}
        />
        <InputField
          name="MothersMname"
          label="Middle Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.MothersMname}
        />
        <InputField
          name="MothersLname"
          label="Last Name"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.MothersLname}
        />
        {/* <InputField name="MothersEmail" label="Email" register={register} isEditing={isEditing} displayValue={studentData.MothersEmail} /> */}
        <InputField
          name="MothersMobileNo"
          label="Mobile Phone No."
          register={register}
          isEditing={isEditing}
          displayValue={studentData.MothersMobileNo}
        />
        <InputField
          name="MothersOccupation"
          label="Occupation"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.MothersOccupation}
        />
      </div>
      <div className="flex items-center pt-4">
        <h2 className="text-xl font-bold text-green-700 mr-4 whitespace-nowrap">
          Emergency Contact Person Information
        </h2>
        <div className="flex-grow">
          <hr className="border-t border-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-4">
        <InputField
          name="ContactPerson"
          label="Fullname"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.ContactPerson}
        />
        <InputField
          name="ContactEmail"
          label="Email"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.ContactEmail}
          isValidEmail={isValidEmail}
        />
        <InputField
          name="Relationship"
          label="Relationship"
          register={register}
          isEditing={isEditing}
          displayValue={studentData.Relationship}
        />
      </div>

      {/* {isEditing && (
                <div className="flex justify-end items-end pt-2 gap-2">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </button>
                    <button
                        // type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
                        // onClick={handleSubmit(onSubmit)}
                    >
                        Proceed to Test Permit
                    </button>
                </div>
            )} */}

      <div className="flex justify-end items-end pt-2 gap-2">
        {isEditing && (
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-800 transition"
          >
            Save
          </button>
        )}

        {/* <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-800 transition"
          onClick={handleSubmit((data) => {
            onSubmit(data, "enroll");
          })}
        >
          Proceed to Enrollment
        </button> */}
      </div>
      </form>

      {/* Documents Tab Section - Below the Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("documents")}
            className="w-full px-6 py-4 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white"
          >
            <FileText size={20} />
            Available Templates
          </button>
        </div>

        {/* Documents Content */}
        <div className="p-6">
          <div className="animate-slideIn">
              <DataTable
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="text-green-600" size={24} />
                      <span className="font-bold text-lg text-green-700">Available Templates</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="px-4 py-2 border border-gray-300 rounded-lg w-64 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                }
                columns={columns}
                data={combinedData}
                progressPending={loadingDocs}
                progressComponent={<Loader />}
                noDataComponent={
                  <div className="py-10 text-center">
                    <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-500 font-medium">No templates found</p>
                    <p className="text-gray-400 text-sm mt-1">Templates will appear here once generated</p>
                  </div>
                }
                pagination
                paginationServer
                paginationTotalRows={totalRows + staticTemplates.length}
                paginationDefaultPage={page}
                onChangePage={(newPage) => setPage(newPage)}
                onChangeRowsPerPage={(newPageSize, newPage) => {
                  setPageSize(newPageSize);
                  setPage(newPage);
                }}
                highlightOnHover
                striped
                responsive
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                      fontWeight: '600',
                    },
                  },
                  rows: {
                    style: {
                      '&:hover': {
                        backgroundColor: '#f0fdf4',
                      },
                    },
                  },
                }}
              />
            </div>
        </div>
      </div>

      {/* Modals */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={<span className="font-bold text-lg text-red-700">Warning</span>}
        body="Are you sure you want to submit?"
        buttons={[
          { label: "Yes", type: "green", onClick: handleConfirmSubmit },
          { label: "No", type: "red" },
        ]}
      />
      <ModalComponent
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        title={<span className="font-bold text-lg text-red-700">Warning</span>}
        body="Are you sure you want to Enroll?"
        buttons={[
          { label: "Yes", type: "green", onClick: handleConfirmSubmit },
          { label: "No", type: "red" },
        ]}
      />
      <ModalComponent
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={
          <span className="font-bold text-lg text-green-700">Success</span>
        }
        body="Student Information has been updated!"
        buttons={[
          {
            label: "OK",
            type: "green",
            onClick: () => setIsSuccessModalOpen(false),
          },
        ]}
      />

      <ModalComponent
        isOpen={isSuccessEnrollOpen}
        onClose={() => setIsSuccessEnrollOpen(false)}
        title={
          <span className="font-bold text-lg text-green-700">Success</span>
        }
        body="Enroll Student Successfully!"
        buttons={[
          {
            label: "OK",
            type: "green",
            onClick: () => setIsSuccessEnrollOpen(false),
          },
        ]}
      />

      {/* View Document Modal */}
      <ModalComponent
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={<span className="font-bold text-lg text-blue-700">{selectedDoc.name}</span>}
        body={
          <div className="max-h-[70vh] w-full p-6">
            {selectedDoc.type === "test-permit" && permitData?.PdfBase64 ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-sm">
                  <span className="text-gray-600">
                    Parent's Email: <span className="font-semibold text-gray-800">{permitData.PrimaryEmail}</span>
                  </span>
                  <span className="text-gray-600">
                    Date Sent: <span className="font-semibold text-gray-800">
                      {permitData.DateCreated ? new Date(permitData.DateCreated).toLocaleDateString() : "—"}
                    </span>
                  </span>
                </div>
                <div className="border rounded-lg shadow overflow-hidden">
                  <iframe
                    src={`data:application/pdf;base64,${permitData.PdfBase64}`}
                    className="w-full h-[50vh]"
                    title="Test Permit Preview"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <FileText className="text-gray-400 mb-3" size={64} />
                <p className="text-gray-500 font-medium">Document not yet generated</p>
                <p className="text-gray-400 text-sm mt-1">Please contact the admission office</p>
              </div>
            )}
          </div>
        }
        buttons={[
          ...(permitData?.PdfBase64 ? [{
            label: "Download",
            type: "green",
            onClick: () => {
              if (permitData?.PdfBase64) {
                const link = document.createElement("a");
                link.href = `data:application/pdf;base64,${permitData.PdfBase64}`;
                link.download = `${permitData.Fname} ${permitData.Mname ?? ""} ${permitData.Lname}-${selectedDoc.name}.pdf`;
                link.click();
              }
            }
          }] : []),
          { label: "Close", type: "blue", onClick: () => setIsViewModalOpen(false) }
        ]}
        size="w-[900px]"
      />
    </div>
  );
};

export default ApplicationFormComponent;
