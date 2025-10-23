import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUserState {
  email: string | null;
  token: string | null;
  data: any | null;
}
const initialState: IUserState = {
  email: null,
  token: null,
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload ?? null;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload ?? null;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.data = action.payload ?? null;
    },
  },
});

export const { setUserToken, setUserData, setUserEmail } = userSlice.actions;
export default userSlice.reducer;
