import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    token: "",
    user: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (state.token && state.token.length > 0) {
        localStorage.setItem("jwt", state.token);
      } else {
        localStorage.removeItem("jwt");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetAll: (state, action) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("jwt");
    },
  },
});

export const { setToken, setUser, resetAll } = sessionSlice.actions;

export default sessionSlice.reducer;
