import { authApi } from '@/store/apis/authApi';
import { contestApi } from '@/store/apis/contestApi';
import { discoverApi } from '@/store/apis/discoverApi';
import { profileApi } from '@/store/apis/profileApi';
import { storeApi } from '@/store/apis/storeApi';
import { teamApi } from '@/store/apis/teamApi';
import { userApi } from '@/store/apis/userApi';
import authReducer from '@/store/slices/authSlice';
import profileReducer from '@/store/slices/profileSlice';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [contestApi.reducerPath]: contestApi.reducer,
      [teamApi.reducerPath]: teamApi.reducer,
      [storeApi.reducerPath]: storeApi.reducer,
      [discoverApi.reducerPath]: discoverApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        authApi.middleware,
        userApi.middleware,
        profileApi.middleware,
        contestApi.middleware,
        teamApi.middleware,
        storeApi.middleware,
        discoverApi.middleware,
      ),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
