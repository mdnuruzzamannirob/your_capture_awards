import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/store/rtkQueryClient";

export const counterApi = createApi({
  reducerPath: "counterApi",
  baseQuery,
  endpoints: (builder) => ({
    getInitialCount: builder.query<number, void>({
      query: () => "/counter",
    }),
  }),
});

export const { useGetInitialCountQuery, util: counterApiUtil } = counterApi;
