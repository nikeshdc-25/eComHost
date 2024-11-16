import { ORDER_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDER_URL}/addorder`,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
      }),
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: ORDER_URL,
      }),
    }),
    updateOrderStatus: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/${data.id}/updatestatus`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderSlice;
