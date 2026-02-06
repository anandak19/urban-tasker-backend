export interface IFindAllOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: Record<string, 1 | -1>;
}

export interface IFindAllAggregationResult<T> {
  data: T[];
  total: { count: number }[];
}
