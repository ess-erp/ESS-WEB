import { create } from "zustand";

const useTemplateStore = create((set) => ({
  isModalOpen: false,
  templateType: "",
  errors: {},

  scoreForm: {
    tempName: "",
    campusId: "",
    fileUpload: null,
    scores: [{ totalScore: "", scoreFrom: "", scoreTo: "", equivalent: "", remarks: "" }],
  },

  generalSubjectForm: {
    tempName: "",
    subjects: [{ subjectCode: "", subjectName: "", remarks: "" }],
  },

  roomForm: {
    tempName: "",
    campusId: "",
    rooms: [{ roomCode: "", roomName: "", remarks: "" }],
  },

  scheduleForm: {
    tempName: "",
    campusId: "",
    roomTempId: "",
    noOfSlot: "",
    startDate: null,
    endDate: null,
    schedules: [{ levelId: "", startTime: "", endTime: "", remarks: "" }],
  },

  // examSubjectForm: {
  //   tempName: "",
  //   examCode: "",
  //   campusId: "",
  //   levelId: "",
  //   // subjects: [{ genSubChildId: 0, numberOfItems: 0 }],

  // },
  // --- Modal ---
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // --- Template type ---
  setTemplateType: (value) => set({ templateType: value }),

  // --- Errors ---
  setErrors: (errors) => set({ errors }),

  // --- Score form updates ---
  setScoreField: (field, value) =>
    set((state) => ({
      scoreForm: { ...state.scoreForm, [field]: value },
    })),

  setGeneralSubjectField: (field, value) =>
    set((state) => ({
      generalSubjectForm: { ...state.generalSubjectForm, [field]: value },
    })),
  setRoomFormField: (field, value) =>
    set((state) => ({
      roomForm: { ...state.roomForm, [field]: value },
    })),
  setScheduleFormField: (field, value) =>
    set((state) => ({
      scheduleForm: { ...state.scheduleForm, [field]: value },
    })),
  // setExamSubjectField: (field, value) =>
  //   set((state) => ({
  //     examSubjectForm: { ...state.examSubjectForm, [field]: value },
  //   })),

  updateScoreRow: (index, field, value) =>
    set((state) => ({
      scoreForm: {
        ...state.scoreForm,
        scores: state.scoreForm.scores.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        ),
      },
    })),

  updateGeneralSubjectRow: (index, field, value) =>
    set((state) => ({
      generalSubjectForm: {
        ...state.generalSubjectForm,
        subjects: state.generalSubjectForm.subjects.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        )
      }
    })),

  updateRoomFormRow: (index, field, value) =>
    set((state) => ({
      roomForm: {
        ...state.roomForm,
        rooms: state.roomForm.rooms.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        )
      }
    })),

  updateScheduleFormRow: (index, field, value) =>
    set((state) => ({
      scheduleForm: {
        ...state.scheduleForm,
        schedules: state.scheduleForm.schedules.map((row, i) =>
          i === index ? { ...row, [field]: value } : row
        )
      }
    })),

  // updateExamSubjectRow: (index, field, value) =>
  //   set((state) => ({
  //     examSubjectForm: {
  //       ...state.examSubjectForm,
  //       subjects: state.examSubjectForm.subjects.map((row, i) =>
  //         i === index ? { ...row, [field]: value } : row
  //       )
  //     }
  //   })),

  addScoreRow: () =>
    set((state) => ({
      scoreForm: {
        ...state.scoreForm,
        scores: [
          ...state.scoreForm.scores,
          { scoreFrom: "", scoreTo: "", equivalent: "", remarks: "" },
        ],
      },
    })),

  addGeneralSubjectRow: () =>
    set((state) => ({
      generalSubjectForm: {
        ...state.generalSubjectForm,
        subjects: [
          ...state.generalSubjectForm.subjects,
          { subjectCode: "", subjectName: "", remarks: "" },
        ],
      },
    })),
  addRoomFormRow: () =>
    set((state) => ({
      roomForm: {
        ...state.roomForm,
        rooms: [
          ...state.roomForm.rooms,
          { roomCode: "", roomName: "", remarks: "" },
        ],
      },
    })),
  addScheduleFormRow: () =>
    set((state) => ({
      scheduleForm: {
        ...state.scheduleForm,
        schedules: [
          ...state.scheduleForm.schedules,
          { levelId: "", startTime: "", endTime: "", remarks: "" },
        ],
      },
    })),

  // addExamSubjectRow: () =>
  //   set((state) => ({
  //     examSubjectForm: {
  //       ...state.examSubjectForm,
  //       subjects: [
  //         ...state.examSubjectForm.subjects,
  //         { genSubChildId: 0, numberOfItems: 0 },
  //       ],
  //     },
  //   })),

  deleteScoreRow: (index) =>
    set((state) => ({
      scoreForm: {
        ...state.scoreForm,
        scores: state.scoreForm.scores.filter((_, i) => i !== index),
      },
    })),

  deleteGeneralSubjectRow: (index) =>
    set((state) => ({
      generalSubjectForm: {
        ...state.generalSubjectForm,
        subjects: state.generalSubjectForm.subjects.filter((_, i) => i !== index),
      },
    })),
  deleteRoomFormRow: (index) =>
    set((state) => ({
      roomForm: {
        ...state.roomForm,
        rooms: state.roomForm.rooms.filter((_, i) => i !== index),
      },
    })),
  deleteScheduleFormRow: (index) =>
    set((state) => ({
      scheduleForm: {
        ...state.scheduleForm,
        schedules: state.scheduleForm.schedules.filter((_, i) => i !== index),
      },
    })),

  // deleteExamSubjectRow: (index) =>
  //   set((state) => ({
  //     examSubjectForm: {
  //       ...state.examSubjectForm,
  //       subjects: state.examSubjectForm.subjects.filter((_, i) => i !== index ),
  //     },
  //   })),

  setFileUpload: (file) =>
    set((state) => ({
      scoreForm: { ...state.scoreForm, fileUpload: file },
    })),

  // setSubjectForm: (field, value)
}));

export default useTemplateStore;
