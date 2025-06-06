import { createSlice } from "@reduxjs/toolkit";

// Define initial state for the reset slice
const initialState = {
  dataToReset: null,
};

// Create the reset slice using createSlice
const resetSlice = createSlice({
  name: "resetSlice",
  initialState,
  reducers: {
    resetData: (state) => {
      state.dataToReset = null; // Reset dataToReset to its initial value
    },
  },
});

// Export the action creator and reducer from the slice
export const { resetData } = resetSlice.actions;
export default resetSlice.reducer;
