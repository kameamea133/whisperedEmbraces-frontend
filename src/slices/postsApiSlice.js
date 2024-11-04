// src/slices/postsApiSlice.js
import { apiSlice } from "./apiSlice";

const POSTS_URL = "/api/posts";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Récupérer tous les textes
    getPosts: builder.query({
      query: () => `${POSTS_URL}`,
      providesTags: ["Post"],
    }),
    getPost: builder.query({
      query: (id) => `${POSTS_URL}/${id}`,
    }),
    // Créer un texte
    createPost: builder.mutation({
      query: (postData) => ({
        url: `${POSTS_URL}`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),
    // Modifier un texte
    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${POSTS_URL}/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    // Supprimer un texte
    deletePost: builder.mutation({
      query: (id) => ({
        url: `${POSTS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation, useGetPostQuery } = postsApiSlice;
