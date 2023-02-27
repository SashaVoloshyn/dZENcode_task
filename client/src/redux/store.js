import { configureStore } from "@reduxjs/toolkit";

import { mainCommentsReducer } from "./slices/mainComments";
import { authReducer } from "./slices/auth";

const store = configureStore({
  reducer:{
    mainComments: mainCommentsReducer,
    auth: authReducer,
  }
})

export default store;