export const TrimStringTransform = ({ value }): string => {
  return typeof value === 'string' ? value.trim() : String(value ?? '');
};
