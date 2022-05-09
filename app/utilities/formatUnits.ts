export const formatUnits = (value: number, unit: string): string => {
  return value ? `${value / 10} ${unit}` : "N/A";
};
