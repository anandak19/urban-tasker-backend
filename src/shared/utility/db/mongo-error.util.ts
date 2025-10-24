export const isDuplicateKeyError = (
  error: unknown,
): error is Error & { code?: number } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  );
};
