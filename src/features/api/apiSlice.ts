import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = `http://localhost:3000/api`;
export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Games", "Places", "Teams"],
  endpoints: (builder) => ({}),
  baseQuery: fetchBaseQuery({ baseUrl }),
});
