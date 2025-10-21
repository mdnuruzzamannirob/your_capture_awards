import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fttfmf0j-5002.inc1.devtunnels.ms",
  prepareHeaders: (headers, { getState }) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
