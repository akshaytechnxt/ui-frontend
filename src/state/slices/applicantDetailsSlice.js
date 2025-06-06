import { createSlice } from "@reduxjs/toolkit";

const applicantDetailsSlice = createSlice({
  name: "applicantDocuments",
  initialState: {
    aadharDocumentAddress: [],
    panAddressDetails: [],
    voterIDDocumentAddress: [],
    //    entityPanAddressDetails: [],
    bankDocumentAddress: [],
    adhaarFrontDocument: [],
    voterBackDocument: []
  },
  reducers: {
    setAadharDocumentAddress: (state, action) => {
      state.aadharDocumentAddress = action.payload;
    },
    setPanDetails: (state, action) => {
      state.panAddressDetails = action.payload;
    },
    setVoterIdDocumentAddress: (state, action) => {
      state.voterIDDocumentAddress = action.payload;
    },
    // setEntityPanDetails: (state, action) => {
    //   state.entityPanAddressDetails = action.payload;
    // },
    setBankDetails: (state, action) => {
      state.bankDocumentAddress = action.payload;
    },
    setAdhaarFrontDocument: (state, action) => {
      state.adhaarFrontDocument = action.payload;
    },
    setVoterBackDocument:(state, action) =>{
      state.voterBackDocument = action.payload;
    },
    resetDocumentData: (state, action) => {
      state.aadharDocumentAddress = [];
      state.panAddressDetails = [];
      state.voterIDDocumentAddress = [];
      state.adhaarFrontDocument = []
      // state.entityPanAddressDetails = [];
    },
  },
});

export const {
  setPanDetails,
  setAadharDocumentAddress,
  setVoterIdDocumentAddress,
  resetDocumentData,
  setAdhaarFrontDocument,
  setBankDetails,
  setVoterBackDocument
} = applicantDetailsSlice.actions;

export default applicantDetailsSlice.reducer;
