export const ToStartDate = ({ value }: { value: string }): Date | null => {
  if (!value) {
    return null;
  }

  const result = new Date(value);

  if (isNaN(result.getTime())) {
    return null;
  }

  result.setHours(0, 0, 0, 0);
  return result;
};

export const ToEndDate = ({ value }: { value: string }): Date | null => {
  if (!value) {
    return null;
  }

  const result = new Date(value);

  if (isNaN(result.getTime())) {
    return null;
  }

  result.setHours(23, 59, 59, 999);
  return result;
};
