import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../axios';

export const fetchCreateComments = createAsyncThunk(
    'comments/fetchCreateComments',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('/comments', params);
            return data;
        } catch (e) {
            console.error(e.response.data.message);
            return rejectWithValue(e.response.data.message);
        }
    }
);

export const deleteComments = createAsyncThunk('comments/deleteComments', async (params, { rejectWithValue }) => {
    const { clientKey, id } = params;
    try {
        const { data } = await axios.delete(`/comments/${id}`, { data: { clientKey } });
        return data;
    } catch (e) {
        return rejectWithValue(e.response.data.message);
    }
});

const initialState = {
    comments: {
        item: null,
        items: [],
        status: 'loading',
    },
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    extraReducers: {
        [fetchCreateComments.pending]: (state) => {
            state.comments.item = null;
            state.comments.status = 'loading';
        },
        [fetchCreateComments.fulfilled]: (state, actions) => {
            state.comments.item = actions.payload.data;
            state.comments.status = 'loaded';
        },
        [fetchCreateComments.rejected]: (state) => {
            state.comments.item = null;
            state.comments.status = 'error';
        },

        [deleteComments.pending]: (state) => {
            state.comments.status = 'loading';
            state.comments.item = null;
        },
        [deleteComments.fulfilled]: (state, actions) => {
            state.comments.item = actions.payload;
        },
        [deleteComments.rejected]: (state) => {
            state.comments.status = 'error';
            state.comments.item = null;
        },
    },
});

export const commentsReducer = commentsSlice.reducer;
