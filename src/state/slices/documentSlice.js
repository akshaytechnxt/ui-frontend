import { createSlice } from "@reduxjs/toolkit";

const documentSlice = createSlice({
    name: "document",
    initialState: {
        bankDocument: [],
        additionalBothDocData: [],
        additionalEntityDocData: [],
        additionalIndividualDocData: [],
        businessPhotoDocument: [],
        residencePhotoDocument: [],
        aadharDocumentAddress: [],
        adhaarFrontDocument: []
        //    panAddressDetails: [],
    },
    reducers: {
        setBankDocument: (state, action) => {
            state.bankDocument = action.payload;
        },
        setAdditionalBothDocument: (state, action) => {
            state.additionalBothDocData = action.payload;
        },
        setAdditionalEntityDocument: (state, action) => {
            state.additionalEntityDocData = action.payload;
        },
        setAdditionalIndividualDocument: (state, action) => {
            state.additionalIndividualDocData = action.payload;
        },
        setBusinessPhotoDocument: (state, action) => {
            state.businessPhotoDocument = action.payload;
        },
        setResidencePhotoDocument: (state, action) => {
            state.residencePhotoDocument = action.payload;
        },
        setAadharDocumentAddress: (state, action) => {
            state.aadharDocumentAddress = action.payload;
        },
        setAdhaarFrontDocument: (state, action) => {
            state.adhaarFrontDocument = action.payload;
        },
        setDocumentReset: (state) => {
            state.bankDocument = [];
            state.additionalBothDocData = [];
            state.additionalEntityDocData = [];
            state.additionalIndividualDocData = [];
            state.businessPhotoDocument = [];
            state.residencePhotoDocument = [];
            state.aadharDocumentAddress = [];
            state.adhaarFrontDocument = [];
        }
        // setPanDetails: (state,action)=> {
        //     state.panAddressDetails = action.payload;
        // },
    }
})

export const { setBankDocument, setBusinessPhotoDocument, setPanDetails, setAadharDocumentAddress, setResidencePhotoDocument, setAdditionalBothDocument, setAdditionalEntityDocument, setAdditionalIndividualDocument, setAdhaarFrontDocument,setDocumentReset } = documentSlice.actions;

export default documentSlice.reducer;
