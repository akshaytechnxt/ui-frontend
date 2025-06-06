import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosRequest from "../../axios-request/API.request";

export const fetchAllProposalById = createAsyncThunk(
  'allProposalfetchAllProposalByIds/fetchById',
  async ({ id, document }, thunkAPI) => {
    console.log('doc', document, id);
    try {
      let url = `proposal/get_docs?proposalId=${id}`;
      // Uncomment the following lines if you want to include the document parameter in the URL
      // if (document) {
      //   url += `&document=${document}`;
      // }
      const response = await axiosRequest.get(url, { secure: true });
      console.log('inside slice',response)
      return response; // Return only the data part of the response
    } catch (error) {
      throw new Error(error.message); // Throw an error to be handled by the rejected action
    }
  }
);

const getAllProposalSlice = createSlice({
  name: 'allProposals',
  initialState: {
    proposal: null,
    status: 'idle',
    error: null
  },
  reducers: {
    resetProposalAllState: state => {
      state.proposal = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProposalById.fulfilled, (state, action) => {
        console.log('actions',action)
        state.status = 'succeeded';
        state.proposal = action.payload.data; // Use action.payload directly since it contains the data
        state.error = null; // Reset error state on successful fetch
      })
     
  }
});

export const { resetProposalAllState } = getAllProposalSlice.actions;

export default getAllProposalSlice.reducer;
