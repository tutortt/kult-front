import { useSyncExternalStore } from "react";
import { getWishlistState, subscribeWishlist } from "../../models/wishlist/wishlist";

export function useWishlist() {
  const state = useSyncExternalStore(subscribeWishlist, getWishlistState, getWishlistState);
  return {
    ids: state.ids,
    count: state.ids.length,
    drawerOpen: state.drawerOpen,
    has: (id) => state.ids.includes(Number(id)),
  };
}
