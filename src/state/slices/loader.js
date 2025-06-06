import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: {
        bagloader:false
    },
    reducers: {
        setLoader: (state, action) => {
            state.bagloader = action.payload;
          },
    }
})

export const { setLoader } = loaderSlice.actions;

export default loaderSlice.reducer;