import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosRequest from "../../axios-request/API.request";

export const fetchProposalById = createAsyncThunk(
  'proposals/fetchById',
  async ({ id, document }, thunkAPI) => {
    console.log('doc', document, id);
    try {
      let url = `proposal/find_one?_id=${id}`;
      if (document) {
        url += `&document=${document}`;
      }
      const response = await axiosRequest.get(url, { secure: true });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const proposalSlice = createSlice({
  name: 'proposals',
  initialState: {
    proposal: null,
    status: 'idle',
    error: null
  },
  reducers: {
    resetProposalState: state => {
      state.proposal = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProposalById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.proposal = action.payload;
      })
      .addCase(fetchProposalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  }
});

export const { resetProposalState } = proposalSlice.actions;
export default proposalSlice.reducer;