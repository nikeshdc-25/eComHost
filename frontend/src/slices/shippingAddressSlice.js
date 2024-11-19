import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: {},
};

const shippingAddressSlice = createSlice({
  name: "shippingAddress",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(state));
    },
    removeShippingAddress: (state) => {
      state.shippingAddress = {};
      localStorage.removeItem("shippingAddress");
    },

  },
});

export const { saveShippingAddress, removeShippingAddress } = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer;
