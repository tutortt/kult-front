const CURRENCY_KEY = "kult_currency_v1";
const USD_RATE = 4000;
const listeners = new Set();

function readCurrency() {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY);
    return raw === "USD" ? "USD" : "COP";
  } catch {
    return "COP";
  }
}

let currentCurrency = readCurrency();

export function subscribeCurrency(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrency() {
  return currentCurrency;
}

export function setCurrency(next) {
  const value = next === "USD" ? "USD" : "COP";
  if (currentCurrency === value) return;
  currentCurrency = value;
  try {
    localStorage.setItem(CURRENCY_KEY, value);
  } catch {
    // ignore storage errors
  }
  for (const listener of listeners) listener();
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatMoney(amountCop, currency = currentCurrency) {
  const value = Number.isFinite(Number(amountCop)) ? Number(amountCop) : 0;
  if (currency === "USD") {
    const usd = Math.max(0, Math.round(value / USD_RATE));
    return `$${usdFormatter.format(usd)} USD`;
  }
  return `$${copFormatter.format(Math.round(value))} COP`;
}

export function formatMoneyParts(amountCop, currency = currentCurrency) {
  const value = Number.isFinite(Number(amountCop)) ? Number(amountCop) : 0;
  if (currency === "USD") {
    const usd = Math.max(0, Math.round(value / USD_RATE));
    return { amount: `$${usdFormatter.format(usd)}`, code: "USD" };
  }
  return { amount: `$${copFormatter.format(Math.round(value))}`, code: "COP" };
}
