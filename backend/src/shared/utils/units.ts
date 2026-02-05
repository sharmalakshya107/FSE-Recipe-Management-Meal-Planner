export const convertUnit = (
  amount: number,
  fromUnit: string,
  toUnit: string,
): number => {
  if (fromUnit === toUnit) return amount;

  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  const weightRates: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
  };

  const volumeRates: Record<string, number> = {
    ml: 1,
    l: 1000,
    tsp: 4.92892,
    tbsp: 14.7868,
    cup: 236.588,
    "fl oz": 29.5735,
    pt: 473.176,
    qt: 946.353,
    gal: 3785.41,
  };

  if (weightRates[from] && weightRates[to]) {
    const amountInGrams = amount * weightRates[from];
    return amountInGrams / weightRates[to];
  }

  if (volumeRates[from] && volumeRates[to]) {
    const amountInMl = amount * volumeRates[from];
    return amountInMl / volumeRates[to];
  }

  return -1;
};
