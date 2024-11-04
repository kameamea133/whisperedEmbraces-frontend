import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    isPlaying: false,
  },
  reducers: {
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const { togglePlayPause, setPlaying } = musicSlice.actions;
export default musicSlice.reducer;
