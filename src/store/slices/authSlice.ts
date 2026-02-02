import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types/authTypes';

const initialState: AuthState = {
  tempEmail: null,
  tempToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },

    setTempToken: (state, action: PayloadAction<string>) => {
      state.tempToken = action.payload;
    },
  },
});

export const { setTempEmail, setTempToken } = authSlice.actions;
export default authSlice.reducer;
