"use client";

import { Provider } from "react-redux";
import { useRef } from "react";
import { makeStore } from "@/store/makeStore";

export function Providers({ children }: { children: React.ReactNode }) {
  // keep a single store instance on client
  const storeRef = useRef(makeStore());
  return <Provider store={storeRef.current}>{children}</Provider>;
}
