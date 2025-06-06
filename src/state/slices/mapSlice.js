import { createSlice } from '@reduxjs/toolkit';

export const mapSlice = createSlice({
  name: 'map',
  initialState: {
    searchLocation: '',
  },
  reducers: {
    setSearchLocation: (state, action) => {
      state.searchLocation = action.payload;
    },
  },
});

export const { setSearchLocation } = mapSlice.actions;

export const selectSearchLocation = (state) => state.map.searchLocation;

export default mapSlice.reducer;
