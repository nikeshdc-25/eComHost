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
  },
});

export const { saveShippingAddress } = shippingAddressSlice.actions;
export default shippingAddressSlice.reducer;
