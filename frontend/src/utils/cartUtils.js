export const updateCart = (state) => {
  state.itemPrice = Number(
    state.cartItems
      .reduce((acc, item) => acc + item.qty * item.discountedPrice, 0)
      .toFixed(2)
  );
  state.shippingCharge = state.itemPrice >= 1000 ? 0 : 200;

  state.totalPrice = Number(
    (state.itemPrice + state.shippingCharge)
  );
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
