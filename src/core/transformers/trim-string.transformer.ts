export const TrimStringTransform = ({ value }): string => {
  return typeof value === 'string' ? value.trim() : String(value ?? '');
};

export const timeStringToMinutes = ({ value }: { value: string }): number => {
  if (typeof value !== 'string') {
    throw new Error('Time must be of string type');
  }

  const match = value.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    throw new Error('Invalid time format. Expected HH:mm');
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours * 60 + minutes;
};
