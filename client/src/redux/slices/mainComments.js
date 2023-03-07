import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";

export const  fetchMainComments = createAsyncThunk("mainComments/fetchMainComments", async () => {
  const { data } = await axios.get("/mainComments");
  return data;

});

export const fetchCreateMainComments = createAsyncThunk("mainComments/fetchCreateMainComments",
    async (params,{rejectWithValue}) => {
  try {
    const {data} = await axios.post("/mainComments", params);
    return data;

  }catch (e) {
    return rejectWithValue(e.response.data.message)

  }
});

export const fetchMainCommentsUserName = createAsyncThunk("mainComments/fetchMainCommentsUserName",
    async (_,{rejectWithValue}) => {
  try {
    const { data } = await axios.get("/mainComments/userName");
    return data;

  }catch (e) {
    return rejectWithValue(e.response.data.message)
  }

});

const initialState = {
  mainComments: {
    item: null,
    items: [],
    status: "loading"
  }
};

const mainCommentsSlice = createSlice({
  name: "mainComments",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchMainComments.pending]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "loading";
    },
    [fetchMainComments.fulfilled]: (state, actions) => {
      state.mainComments.items = actions.payload.data;
      console.log(state.mainComments.items);
      state.mainComments.status = "loaded"
    },
    [fetchMainComments.rejected]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "error";
    },

    [fetchCreateMainComments.pending]: (state) => {
      state.mainComments.item = null;
      state.mainComments.status = "loading";
    },
    [fetchCreateMainComments.fulfilled]: (state, actions) => {
      state.mainComments.item = actions.payload.data;
      state.mainComments.status = "loaded";
    },
    [fetchCreateMainComments.rejected]: (state) => {
      state.mainComments.item = null;
      state.mainComments.status = "error";
    }
  }

});


export const mainCommentsReducer = mainCommentsSlice.reducer;