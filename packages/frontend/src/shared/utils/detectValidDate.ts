export const detectValidDate = (value: Date): boolean => {
  return !Number.isNaN(value.getTime());
};
