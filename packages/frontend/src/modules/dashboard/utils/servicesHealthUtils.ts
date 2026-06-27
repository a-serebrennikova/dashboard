export const getUptimePercent = (values: number[]) => {
  if (values.length === 0) {
    return null;
  }

  const activePoints = values.reduce((sum, point) => sum + point, 0);
  return Math.round((activePoints / values.length) * 100);
};

export const getFlapCount = (values: number[]) => {
  if (values.length < 2) {
    return 0;
  }

  let count = 0;

  for (let index = 1; index < values.length; index += 1) {
    if (values[index] !== values[index - 1]) {
      count += 1;
    }
  }

  return count;
};
