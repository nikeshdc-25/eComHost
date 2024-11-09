import { WISHLIST_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const wishlistSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWishlist: builder.mutation({
      query: (wishlistItem) => ({
        url: `${WISHLIST_URL}/addwishlist`,
        method: "POST",
        body: { wishlistItems: [wishlistItem] },
      }),
    }),
    getWishlist: builder.query({
      query: () => ({
        url: `${WISHLIST_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    removeWishlist: builder.mutation({
      query: (productId) => ({
        url: `${WISHLIST_URL}/removewishlist/${productId}`,
        method: "DELETE",
      }), 
    }),
  }),
});

export const {
  useAddWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} = wishlistSlice;
