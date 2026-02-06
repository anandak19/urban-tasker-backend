export function generatePrefixedId(
  prefix: string,
  options?: {
    alphaLength?: number;
    numericLength?: number;
  },
): string {
  const alphaLength = options?.alphaLength ?? 5;
  const numericLength = options?.numericLength ?? 4;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const randomAlpha = Array.from({ length: alphaLength })
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join('');

  const randomNumber = Array.from({ length: numericLength })
    .map(() => numbers[Math.floor(Math.random() * numbers.length)])
    .join('');

  return `${prefix}-${randomAlpha}-${randomNumber}`;
}
