import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({ baseUrl: backendUrl, credentials: "include" });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User", "Post"],
    // eslint-disable-next-line no-unused-vars
    endpoints: (builder) => ({}),
});