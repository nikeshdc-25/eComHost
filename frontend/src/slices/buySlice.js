import { createSlice } from "@reduxjs/toolkit";
import { updateBuy } from "../utils/buyUtils";

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
      return updateBuy(state);
    },
  },
});

export const { saveProductDetails } = buySlice.actions;
export default buySlice.reducer;
