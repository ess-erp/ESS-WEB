import { create } from "zustand";

const useTemplateStore = create((set) => ({
    isModalOpen: false,

    templateType: "",
    errors: {},


    bookletForm: {
        tempName: "",
        orNumberList: [{ startNo: "", endNo: "", userId: "", orType: "", remarks: "", }],
    },

    feesForm: {
        tempName: "",
        remarks: "",
        feesChildForm: [{ transCode: "", transType: "", transGroup: "", value: "", }],
    },

    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),

    setTemplateType: (value) => set({ templateType: value }),

    setErrors: (errors) => set({ errors }),

    setBookletFormField: (field, value) =>
        set((state) => ({
            bookletForm: { ...state.bookletForm, [field]: value },
        })),

    setFeesFormField: (field, value) =>
        set((state) => ({
            feesForm: { ...state.feesForm, [field]: value },
        })),

    updateBookletFormRow: (index, field, value) =>
        set((state) => ({
            bookletForm: {
                ...state.bookletForm,
                orNumberList: state.bookletForm.orNumberList.map((row, i) =>
                    i === index ? { ...row, [field]: value } : row
                ),
            },
        })),

    updateFeesFormRow: (index, field, value) =>
        set((state) => ({
            feesForm: {
                ...state.feesForm,
                feesChildForm: state.feesForm.feesChildForm.map((row, i) =>
                    i === index ? { ...row, [field]: value } : row
                ),
            },
        })),


    addBookletFormRow: () =>
        set((state) => ({
            bookletForm: {
                ...state.bookletForm,
                orNumberList: [
                    ...state.bookletForm.orNumberList,
                    { startNo: "", endNo: "", userId: "", orType: "", remarks: "", },
                ],
            },
        })),

    addFeesFormRow: () =>
        set((state) => ({
            feesForm: {
                ...state.feesForm,
                feesChildForm: [
                    ...state.feesForm.feesChildForm,
                    { transCode: "", transType: "", transGroup: "", value: "", },
                ],
            },
        })),

    deleteBookletFormRow: (index) =>
        set((state) => ({
            bookletForm: {
                ...state.bookletForm,
                orNumberList: state.bookletForm.orNumberList.filter((_, i) => i !== index),
            },
        })),

    deleteFeesFormRow: (index) =>
        set((state) => ({
            feesForm: {
                ...state.feesForm,
                feesChildForm: state.feesForm.feesChildForm.filter((_, i) => i !== index),
            },
        })),

    setFileUploadBooklet: (file) =>
        set((state) => ({
            bookletForm: { ...state.bookletForm, fileUpload: file },
        })),
}));

export default useTemplateStore;