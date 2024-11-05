import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "https://whispered-embraces-backend.vercel.app", credentials: "include" });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["User", "Post"],
    // eslint-disable-next-line no-unused-vars
    endpoints: (builder) => ({}),
});
