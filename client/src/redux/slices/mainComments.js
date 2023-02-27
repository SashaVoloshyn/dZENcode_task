import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";

export const fetchMainComments = createAsyncThunk("mainComments/fetchMainComments", async () => {
  const { data } = await axios.get("/mainComments");
  return data;

});

const initialState = {
  mainComments: {
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
      state.mainComments.status = "loaded";
    },
    [fetchMainComments.rejected]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "error";
    }
  }

});


export const mainCommentsReducer = mainCommentsSlice.reducer;