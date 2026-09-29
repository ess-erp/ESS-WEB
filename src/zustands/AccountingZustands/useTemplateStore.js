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

    tuitionForm: {
        tempName: "",
        plan: "",
        levelId: "",
        amountA: "",
        dateOfPaymentA: "",
        amountB1: "",
        dateOfPaymentB1: "",
        amountB2: "",
        dateOfPaymentB2: "",
        amountC1: "",
        dateOfPaymentC1: "",
        amountC2: "",
        dateOfPaymentC2: "",
        amountC3: "",
        dateOfPaymentC3: "",
        amountD1: "",
        dateOfPaymentD1: "",
        amountD2: "",
        dateOfPaymentD2: "",
        amountD3: "",
        dateOfPaymentD3: "",
        amountD4: "",
        dateOfPaymentD4: "",
    },

    miscForm: {
        tempName: "",
        schoolYear: "",
        rows: [{ feeName: "", amounts: {} }],
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
    
    setTuitionFormField: (field, value) =>
        set((state) => ({
            tuitionForm: { ...state.tuitionForm, [field]: value },
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

    setMiscFormField: (field, value) =>
        set((state) => ({
            miscForm: { ...state.miscForm, [field]: value },
        })),

    addMiscRow: () =>
        set((state) => ({
            miscForm: {
                ...state.miscForm,
                rows: [...state.miscForm.rows, { feeName: "", amounts: {} }],
            },
        })),

    deleteMiscRow: (index) =>
        set((state) => ({
            miscForm: {
                ...state.miscForm,
                rows: state.miscForm.rows.filter((_, i) => i !== index),
            },
        })),

    updateMiscRow: (index, field, value) =>
        set((state) => ({
            miscForm: {
                ...state.miscForm,
                rows: state.miscForm.rows.map((row, i) =>
                    i === index ? { ...row, [field]: value } : row
                ),
            },
        })),

    updateMiscAmount: (rowIndex, levelKey, value) =>
        set((state) => ({
            miscForm: {
                ...state.miscForm,
                rows: state.miscForm.rows.map((row, i) =>
                    i === rowIndex
                        ? { ...row, amounts: { ...row.amounts, [levelKey]: value } }
                        : row
                ),
            },
        })),
}));
export default useTemplateStore;
