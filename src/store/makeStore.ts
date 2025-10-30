import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/features/auth/authSlice';
import profileReducer from '@/store/features/profile/profileSlice';
import { authApi } from './features/auth/authApi';
import { userApi } from './features/user/userApi';
import { profileApi } from './features/profile/profileApi';
import { contestApi } from './features/contest/contestApi';

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
