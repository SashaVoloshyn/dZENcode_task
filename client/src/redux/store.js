import { configureStore } from "@reduxjs/toolkit";

import { mainCommentsReducer } from "./slices/mainComments";
import { authReducer } from "./slices/auth";
import {commentsReducer} from "./slices/comments";

const store = configureStore({
  reducer:{
    mainComments: mainCommentsReducer,
    auth: authReducer,
    comments: commentsReducer,
  }
})

export default store;