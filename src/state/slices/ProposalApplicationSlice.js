import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosRequest from "../../axios-request/API.request";

export const updateProposalApplicationById = createAsyncThunk(
  'proposalsApplication/updateById',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axiosRequest.put(`proposal/${id}`, data, { secure: true });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const ProposalApplicationSlice = createSlice({
  name: 'proposalsApplication',
  initialState: {
    proposal: null,
    status: 'idle',
    error: null,
    submitResponse: null, 
  },
  reducers: {
    setSubmitResponse(state, action) {
      state.submitResponse = action.payload;
    },
    resetState(state) {
      state.proposal = null;
      state.status = 'idle';
      state.error = null;
      state.submitResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProposalApplicationById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProposalApplicationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.proposal = action.payload;
      })
      .addCase(updateProposalApplicationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSubmitResponse, resetState } = ProposalApplicationSlice.actions; // Fix the export statement
export default ProposalApplicationSlice.reducer;
