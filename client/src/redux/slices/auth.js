import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "../../axios";

export const fetchLogin = createAsyncThunk("auth/fetchLogin", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchRegister = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/registration", params);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
  userData:null

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;

      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("clientKey");

    }
  },
  extraReducers: {
    [fetchLogin.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchLogin.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },

    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.userData = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.userData = action.payload;
    },
    [fetchRegister.rejected]: (state) => {
      state.userData = null;
      state.status = "error";
    }
  }
});

export const selectIsAuth = state => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;