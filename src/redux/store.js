import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editor";

export default configureStore({
  reducer: {
    editor: editorReducer,
  },
});
