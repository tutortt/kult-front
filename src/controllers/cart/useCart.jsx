import { useSyncExternalStore } from "react";
import {
  getCartDiscount,
  getCartState,
  getShippingCost,
  SHIPPING_OPTIONS,
  subscribeCart,
} from "../../models/cart/cart";

export function useCart() {
  const state = useSyncExternalStore(subscribeCart, getCartState, getCartState);
  const items = state.items;
  const count = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const discount = getCartDiscount(subtotal, state.promo);
  const shippingCost = getShippingCost(state.shippingId, items);
  const total = Math.max(0, subtotal - discount + shippingCost);
  const ivaIncluded = Math.round(total - total / 1.19);
  const shippingOption = SHIPPING_OPTIONS[state.shippingId] ?? SHIPPING_OPTIONS.standard;

  return {
    items,
    count,
    subtotal,
    discount,
    shippingId: state.shippingId,
    shippingOption,
    shippingCost,
    total,
    ivaIncluded,
    promo: state.promo,
    drawerOpen: state.drawerOpen,
    toast: state.toast,
  };
}
