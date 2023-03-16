import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";

export const  fetchMainComments = createAsyncThunk("mainComments/fetchMainComments", async (page) => {
  const { data } = await axios.get("/mainComments", {params:{page}});
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
    async (page,{rejectWithValue}) => {
  try {
    const { data } = await axios.get("/mainComments/userName",{params:{page}});
    return data;

  }catch (e) {
    return rejectWithValue(e.response.data.message)
  }

});

export const fetchMainCommentsUserEmail = createAsyncThunk("mainComments/fetchMainCommentsUserEmail",
    async (page,{rejectWithValue}) => {
      try {
        const { data } = await axios.get("/mainComments/userEmail",{params:{page}});
        return data;

      }catch (e) {
        return rejectWithValue(e.response.data.message)
      }

    });

const initialState = {
  mainComments: {
    itemsCount:0,
    currentPage:1,
    item: null,
    items: [],
    status: "loading"
  }
};

const mainCommentsSlice = createSlice({
  name: "mainComments",
  initialState,
  reducers: {
    getPage: (state, action)=>{
      state.mainComments.currentPage=action.payload.page
      console.log(state.mainComments.currentPage)
    }
  },
  extraReducers: {
    [fetchMainComments.pending]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "loading";
    },
    [fetchMainComments.fulfilled]: (state, actions) => {
      state.mainComments.items = actions.payload.data;
      state.mainComments.itemsCount = actions.payload.data[1];
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
    },

    [fetchMainCommentsUserName.pending]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "loading";
    },
    [fetchMainCommentsUserName.fulfilled]: (state, actions) => {
      state.mainComments.items = actions.payload.data;
      console.log(state.mainComments.items);
      state.mainComments.status = "loaded"
    },
    [fetchMainCommentsUserName.rejected]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "error";
    },

    [fetchMainCommentsUserEmail.pending]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "loading";
    },
    [fetchMainCommentsUserEmail.fulfilled]: (state, actions) => {
      state.mainComments.items = actions.payload.data;
      console.log(state.mainComments.items);
      state.mainComments.status = "loaded"
    },
    [fetchMainCommentsUserEmail.rejected]: (state) => {
      state.mainComments.items = [];
      state.mainComments.status = "error";
    },

  }

});

export const {getPage} = mainCommentsSlice.actions;


export const mainCommentsReducer = mainCommentsSlice.reducer;