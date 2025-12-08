export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const isInvalidTimes = (start: string, end: string): boolean => {
  return timeToMinutes(end) <= timeToMinutes(start);
};
