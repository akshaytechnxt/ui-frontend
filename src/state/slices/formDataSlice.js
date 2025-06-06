import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basicDetails: {
    personalInfo: {},
    documents: {}
  },
  entityDetails: {
    businessInfo: {},
    documents: {}
  },
  employmentDetails: {
    employmentInfo: {},
    documents: {}
  },
  bankDetails: {
    bankInfo: {},
    documents: {}
  },
  loanDetails: {
    loanInfo: {},
    documents: {}
  }
};

const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    updateBasicDetails: (state, action) => {
      state.basicDetails.personalInfo = {
        ...state.basicDetails.personalInfo,
        ...action.payload
      };
    },
    updateBasicDetailsDocuments: (state, action) => {
      state.basicDetails.documents = {
        ...state.basicDetails.documents,
        ...action.payload
      };
    },
    updateEntityDetails: (state, action) => {
      state.entityDetails.businessInfo = {
        ...state.entityDetails.businessInfo,
        ...action.payload
      };
    },
    updateEntityDetailsDocuments: (state, action) => {
      state.entityDetails.documents = {
        ...state.entityDetails.documents,
        ...action.payload
      };
    },
    updateEmploymentDetails: (state, action) => {
      state.employmentDetails.employmentInfo = {
        ...state.employmentDetails.employmentInfo,
        ...action.payload
      };
    },
    updateEmploymentDetailsDocuments: (state, action) => {
      state.employmentDetails.documents = {
        ...state.employmentDetails.documents,
        ...action.payload
      };
    },
    updateBankDetails: (state, action) => {
      state.bankDetails.bankInfo = {
        ...state.bankDetails.bankInfo,
        ...action.payload
      };
    },
    updateBankDetailsDocuments: (state, action) => {
      state.bankDetails.documents = {
        ...state.bankDetails.documents,
        ...action.payload
      };
    },
    updateLoanDetails: (state, action) => {
      state.loanDetails.loanInfo = {
        ...state.loanDetails.loanInfo,
        ...action.payload
      };
    },
    updateLoanDetailsDocuments: (state, action) => {
      state.loanDetails.documents = {
        ...state.loanDetails.documents,
        ...action.payload
      };
    },
    resetFormData: (state) => {
      return initialState;
    }
  }
});

export const {
  updateBasicDetails,
  updateBasicDetailsDocuments,
  updateEntityDetails,
  updateEntityDetailsDocuments,
  updateEmploymentDetails,
  updateEmploymentDetailsDocuments,
  updateBankDetails,
  updateBankDetailsDocuments,
  updateLoanDetails,
  updateLoanDetailsDocuments,
  resetFormData
} = formDataSlice.actions;

export default formDataSlice.reducer; 