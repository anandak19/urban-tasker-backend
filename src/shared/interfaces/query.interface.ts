export interface PaginatedResult<T> {
  documents: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
}
