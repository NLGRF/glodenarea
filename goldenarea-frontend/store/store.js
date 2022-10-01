import { configureStore } from "@reduxjs/toolkit";
import sessionReducers from "./session";
export default configureStore({
  reducer: {
    session: sessionReducers,
  },
});
