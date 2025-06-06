import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from "../../axios-request/API.request";
export const updateProposalById = createAsyncThunk(
    'proposalsDetails/updateById',
    async ({ id, data }, thunkAPI) => {
      try {
        const response = await axiosRequest.put(`proposal/applicant/update/${id}`, data, { secure: true });
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  );

  
  
  const ProposalDetailsSlice = createSlice({
    name: 'proposalsDetails',
    initialState: {
      proposal: null,
      status: 'idle',
      error: null
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(updateProposalById.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateProposalById.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.proposal = action.payload;
        })
        .addCase(updateProposalById.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    }
  });
  
  export default ProposalDetailsSlice.reducer;