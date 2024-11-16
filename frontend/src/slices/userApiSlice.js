import { USER_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    updatedUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateprofile`,
        method: "PUT",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    updateUserAdmin: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/updateuseradmin/${id}`,
        method: "PUT",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/deleteuser/${id}`,
        method: "DELETE",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUserLogoutMutation,
  useUpdatedUserProfileMutation,
  useSignupMutation,
  useUpdateUserAdminMutation,
  useDeleteUserMutation,
  useGetUserQuery,
} = userApiSlice;
