import { createSlice } from "@reduxjs/toolkit";

export const editorSlice = createSlice({
  name: "editor",
  initialState: {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    preview: ''
  },
  reducers: {
    updateCropData: (state, action) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    updatePreview: (state, action) => {
      state.preview = action.payload.preview
    }
  },
});

// Action creators are generated for each case reducer function
export const { updateCropData, updatePreview } = editorSlice.actions;

export default editorSlice.reducer;
