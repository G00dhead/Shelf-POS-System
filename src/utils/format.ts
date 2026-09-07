/**
 * Format currency amounts nicely with the Nigerian Naira symbol or custom store currency.
 */
export const formatMoney = (amount: number, currency = '₦'): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return `${currency}${safeAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Format compact money (e.g. ₦12.5k) for small badges
 */
export const formatCompactMoney = (amount: number, currency = '₦'): string => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  if (Math.abs(safeAmount) >= 1_000_000) {
    return `${currency}${(safeAmount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(safeAmount) >= 1_000) {
    return `${currency}${(safeAmount / 1_000).toFixed(1)}k`;
  }
  return formatMoney(safeAmount, currency);
};
