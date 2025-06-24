import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import musiReducer from "./slices/musicSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        music: musiReducer
    },
    devTools: true
});

export default store;