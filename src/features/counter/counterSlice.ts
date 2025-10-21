import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CounterState } from "./types";

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => void (state.value += 1),
    decrement: (state) => void (state.value -= 1),
    set: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, set } = counterSlice.actions;
export default counterSlice.reducer;
