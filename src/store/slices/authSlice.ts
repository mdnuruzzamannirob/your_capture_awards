import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '../types/authTypes';

const initialState: AuthState = {
  user: null,
  tempEmail: null,
  tempToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    resetAuth: () => ({ ...initialState }),
    clearUser: (state) => {
      state.user = null;
    },
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },
    setTempToken: (state, action: PayloadAction<string>) => {
      state.tempToken = action.payload;
    },
  },
});

export const { setUser, resetAuth, clearUser, setTempEmail, setTempToken } = authSlice.actions;
export default authSlice.reducer;
