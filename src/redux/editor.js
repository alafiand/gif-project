import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    preview: '',
    outputGif: '',
    inputVideo: '',
    outputFileSize: 0,
    size: 80,
    startTime: 0,
    clipLength: 3
  },
  reducers: {
    generalUpdate: (state, action) => {
      for (let key in action.payload) {
        state[key] = action.payload[key]
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { generalUpdate } = editorSlice.actions;


export default editorSlice.reducer;
