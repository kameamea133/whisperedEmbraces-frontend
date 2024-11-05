import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL, credentials: "include" });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User", "Post"],
    // eslint-disable-next-line no-unused-vars
    endpoints: (builder) => ({}),
});
