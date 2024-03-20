import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

/* Reducers */
import userSlice from "./user.slice";

export const store = configureStore({
    reducer: {
        user: userSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();