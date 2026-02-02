import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import profileReducer from '@/store/slices/profileSlice';
import { authApi } from '@/store/apis/authApi';
import { userApi } from '@/store/apis/userApi';
import { profileApi } from '@/store/apis/profileApi';
import { contestApi } from '@/store/apis/contestApi';

export const makeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        authApi.middleware,
        userApi.middleware,
        profileApi.middleware,
        contestApi.middleware,
      ),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
