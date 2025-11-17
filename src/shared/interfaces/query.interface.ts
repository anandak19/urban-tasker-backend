export interface PaginatedResult<T> {
  documents: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface IFindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
}
