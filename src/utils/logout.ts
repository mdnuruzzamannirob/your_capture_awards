import { removeTokenCookie } from '@/utils/tokenCookie';
import { resetAuth } from '@/store/slices/authSlice';
import { authApi } from '@/store/apis/authApi';
import { contestApi } from '@/store/apis/contestApi';
import { profileApi } from '@/store/apis/profileApi';
import { teamApi } from '@/store/apis/teamApi';
import { userApi } from '@/store/apis/userApi';
import type { AppDispatch } from '@/store/makeStore';

const apiSlices = [authApi, userApi, profileApi, contestApi, teamApi] as const;

export const logout = (dispatch: AppDispatch) => {
  removeTokenCookie();
  dispatch(resetAuth());

  apiSlices.forEach((api) => {
    dispatch(api.util.resetApiState());
  });
};
