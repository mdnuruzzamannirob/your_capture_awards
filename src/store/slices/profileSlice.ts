import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, Photo, Stats } from '../types/profileTypes';

const initialState: ProfileState = {
  photos: [],
  stats: null,
  achievements: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<Photo[]>) => {
      state.photos = action.payload;
    },

    setPhoto: (state, action: PayloadAction<Photo>) => {
      if (state.photos) {
        state.photos.push(action.payload);
      } else {
        state.photos = [action.payload];
      }
    },

    deletePhoto: (state, action: PayloadAction<string>) => {
      if (state.photos) {
        state.photos = state.photos.filter((photo) => photo.id !== action.payload);
      }
    },

    setStats: (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
    },

    setAchievements: (state, action: PayloadAction<string>) => {
      //   state.tempToken = action.payload;
    },
  },
});

export const { setPhotos, setPhoto, deletePhoto, setStats, setAchievements } = profileSlice.actions;
export default profileSlice.reducer;
