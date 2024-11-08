export const updateBuy = (state) => {
  state.itemPrice = Number(
    (state.productDetails.qty * state.productDetails.discountedPrice)
  )
  state.shippingCharge = state.itemPrice >= 1000 ? 0 : 200;

  state.totalPrice = Number(
    (state.itemPrice + state.shippingCharge)
  );
  localStorage.setItem("buynow", JSON.stringify(state));
  return state;
};
