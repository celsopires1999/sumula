import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = `http://localhost:8000`;
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Games", "Places"],
  endpoints: (builder) => ({}),
  baseQuery: fetchBaseQuery({ baseUrl }),
});
