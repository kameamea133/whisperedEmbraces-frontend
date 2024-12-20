import { apiSlice } from "./apiSlice";

const USER_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({

            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/register`,
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: 'POST',
            })
           
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'], 
        }),
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation } = usersApiSlice;