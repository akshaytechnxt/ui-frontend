import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import mapReducer from "./slices/mapSlice";
import loaderReducer from "./slices/loader";
import proposalReducer from "./slices/proposalSlice";
import getAllProposalReducer from "./slices/getAllProposalSlice";
import proposalApplicationReducer from "./slices/ProposalApplicationSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import documentReducer from "./slices/documentSlice";
import applicantReducer from "./slices/applicantDetailsSlice"
import entityDocumentReducer from "./slices/entityDocuments"
import formDataReducer from './slices/formDataSlice';

const persistConfig = {
    key: "root",
    version: 1,
    storage
}

const reducer = combineReducers({
    user: userReducer,
    map: mapReducer,
    loader:loaderReducer,
    fetchProposal:proposalReducer,
    fetchAllProposal: getAllProposalReducer,
    proposalApplication: proposalApplicationReducer,
    document: documentReducer,
    applicantDoc: applicantReducer,
    entityDoc: entityDocumentReducer,
    formData: formDataReducer
})

const  persistedReducer = persistReducer(persistConfig,reducer);
const store = configureStore({
    reducer: persistedReducer,
})



export default store;