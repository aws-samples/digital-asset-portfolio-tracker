const usdFormatter = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD'
});

export function formatNumber(input: number | string, decimals?: number) {
  return Intl.NumberFormat('en-us', { maximumFractionDigits: decimals }).format(+input);
}

export function formatUsd(input: number | string) {
  return usdFormatter.format(+input);
}
