import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("buynow")
  ? JSON.parse(localStorage.getItem("buynow"))
  : {
      productDetails: {},
    };

const buySlice = createSlice({
  name: "buynow",
  initialState,
  reducers: {
    saveProductDetails: (state, action) => {
      state.productDetails = action.payload;
      localStorage.setItem("buynow", JSON.stringify(state));
    },
  },
});

export const { saveProductDetails } = buySlice.actions;
export default buySlice.reducer;
