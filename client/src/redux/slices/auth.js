import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import axios from "../../axios";

const initialState = {
    data: null,
    status: "loading",
    userData: null,
    error: null

};

export const fetchLogin = createAsyncThunk("auth/fetchLogin", async (params, {rejectWithValue}) => {
    try {
        const {data} = await axios.post("/auth/login", params);
        return data;

    } catch (e) {
        return rejectWithValue(e.response.data.message)
    }
});

export const fetchRegister = createAsyncThunk("auth/fetchAuth", async (params,{rejectWithValue}) => {
  try {
      const {data} = await axios.post("/auth/registration", params);
      return data;

  }catch (e) {
      return rejectWithValue(e.response.data.message)

  }
});

export const fetchRefresh = createAsyncThunk("auth/fetchRefresh", async (
    _, {dispatch, rejectWithValue}) => {
    try {
        const {data} = await axios.post("/auth/refresh",
            {clientKey: `${window.localStorage.getItem("clientKey")}`},
            {
                headers: {Authorization: `Bearer ${window.localStorage.getItem("refreshToken")}`}
            });
        return data;

    } catch (e) {
        if (e.response.data.message === 'jwt expired') {

            return rejectWithValue(dispatch(logout()));
        }
    }
});

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async (
    params, {dispatch, rejectWithValue}) => {
    try {
        const {data} = await axios.get("/auth/me", params);
        return data;

    } catch (e) {
        console.log(e.response.data.message, `''''''''''''''''''''''''''''''''''`);
        return rejectWithValue(dispatch(customErr(e.response.data.message)))


    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        customErr: (state, actions) => {
            state.error = actions.payload
        },
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
        [fetchAuthMe.pending]: (state) => {
            state.status = "loading";
            state.userD = null;
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.userData = action.payload;
            state.data = action.payload;
        },
        [fetchAuthMe.rejected]: (state) => {
            state.userData = null;
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
        },


        [fetchRefresh.pending]: (state) => {
            state.status = "loading";
            state.data = null;
        },
        [fetchRefresh.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        },
        [fetchRefresh.rejected]: (state) => {
            state.data = null;
            state.status = "error";

        }
    }
});

export const selectIsAuth = state => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const {logout, customErr} = authSlice.actions;