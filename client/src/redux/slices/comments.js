import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../axios";


export const fetchCreateComments = createAsyncThunk("comments/fetchCreateComments",
    async (params,{rejectWithValue}) => {
        try {
            const {data} = await axios.post("/comments", params);
            return data;

        }catch (e) {
            return rejectWithValue(e.response.data.message)

        }
    });

const initialState = {
    comments: {
        item: null,
        items: [],
        status: "loading"
    }
};


const commentsSlice = createSlice({
    name: "comments",
    initialState,
    extraReducers:{
        [fetchCreateComments.pending]: (state) => {
            state.mainComments.item = null;
            state.mainComments.status = "loading";
        },
        [fetchCreateComments.fulfilled]: (state, actions) => {
            state.mainComments.item = actions.payload.data;
            state.mainComments.status = "loaded";
        },
        [fetchCreateComments.rejected]: (state) => {
            state.mainComments.item = null;
            state.mainComments.status = "error";
        },

    }


});

export const commentsReducer = commentsSlice.reducer;