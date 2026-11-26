import { useSyncExternalStore } from "react";
import {
  formatMoney,
  formatMoneyParts,
  getCurrency,
  setCurrency,
  subscribeCurrency,
} from "../../models/currency/currency";

export function useCurrency() {
  const currency = useSyncExternalStore(subscribeCurrency, getCurrency, getCurrency);
  return {
    currency,
    setCurrency,
    format: (amount) => formatMoney(amount, currency),
    formatParts: (amount) => formatMoneyParts(amount, currency),
  };
}
