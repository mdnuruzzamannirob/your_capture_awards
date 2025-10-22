import { configureStore } from "@reduxjs/toolkit";
import { counterApi } from "@/store/features/counter/counterApi";
import counterReducer from "@/store/features/counter/counterSlice";
// import { userApi } from "@/features/user";
// import userReducer from "@/features/user";

export const makeStore = () =>
  configureStore({
    reducer: {
      counter: counterReducer,
      //   user: userReducer,
      [counterApi.reducerPath]: counterApi.reducer,
      //   [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(counterApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
