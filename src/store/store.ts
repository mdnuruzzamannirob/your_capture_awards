import { createWrapper } from "next-redux-wrapper";
import { makeStore } from "./makeStore";

export const wrapper = createWrapper(makeStore, { debug: false });
