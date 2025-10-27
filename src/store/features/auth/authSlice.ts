import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

const initialState: AuthState = {
  token: null,
  user: null,
  tempEmail: null,
  tempToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      const { token, user } = action.payload;
      state.user = user;
      state.token = token || null;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },

    setTempToken: (state, action: PayloadAction<string>) => {
      state.tempToken = action.payload;
    },

    signout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, setUser, setTempEmail, setTempToken, signout } = authSlice.actions;
export default authSlice.reducer;
