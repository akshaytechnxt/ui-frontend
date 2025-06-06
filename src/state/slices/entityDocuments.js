import { createSlice } from "@reduxjs/toolkit";

const entityDocuments = createSlice({
    name: "entityDocuments",
    initialState: {
       entityPanAddressDetails: [],
    },
    reducers: {
        
        setEntityPanDetails: (state,action)=> {
            state.entityPanAddressDetails = action.payload;
        },
        resetEntityDocumentData: (state,action)=> {
            state.entityPanAddressDetails = [];
        },
    }
})

export const {setEntityPanDetails,resetEntityDocumentData} = entityDocuments.actions;

export default entityDocuments.reducer;
