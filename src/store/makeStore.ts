import { configureStore } from "@reduxjs/toolkit";
// import { counterApi } from "@/features/counter";
// import { userApi } from "@/features/user";
// import counterReducer from "@/features/counter";
// import userReducer from "@/features/user";

export const makeStore = () =>
  configureStore({
    reducer: {
      //   counter: counterReducer,
      //   user: userReducer,
      //   [counterApi.reducerPath]: counterApi.reducer,
      //   [userApi.reducerPath]: userApi.reducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: false,
    //   }).concat(counterApi.middleware, userApi.middleware),
    // devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
