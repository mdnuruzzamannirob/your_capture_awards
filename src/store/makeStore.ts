import { authApi } from '@/store/apis/authApi';
import { contestApi } from '@/store/apis/contestApi';
import { discoverApi } from '@/store/apis/discoverApi';
import { profileApi } from '@/store/apis/profileApi';
import { supportApi } from '@/store/apis/supportApi';
import { storeApi } from '@/store/apis/storeApi';
import { teamApi } from '@/store/apis/teamApi';
import { userApi } from '@/store/apis/userApi';
import { sitePolicyApi } from '@/store/apis/sitePolicyApi';
import { socialApi } from '@/store/apis/socialApi';
import { commentsApi } from '@/store/apis/commentsApi';
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
      [supportApi.reducerPath]: supportApi.reducer,
      [discoverApi.reducerPath]: discoverApi.reducer,
      [sitePolicyApi.reducerPath]: sitePolicyApi.reducer,
      [socialApi.reducerPath]: socialApi.reducer,
      [commentsApi.reducerPath]: commentsApi.reducer,
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
        supportApi.middleware,
        discoverApi.middleware,
        sitePolicyApi.middleware,
        socialApi.middleware,
        commentsApi.middleware,
      ),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
