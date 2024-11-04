import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5000", credentials: "include" });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User", "Post"],
    // eslint-disable-next-line no-unused-vars
    endpoints: (builder) => ({}),
});