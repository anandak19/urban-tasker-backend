/**
 * Paginated result type
 * Passed type should be the type of signle document in the result
 *
 * ex:
 * PaginatedResult<IMyData>
 *
 * will create the type:
 * {
 *  documents: IMyData[],
 *  meta: {
 *   total: number;
 *   page: number;
 *   limit: number;
 *   pages: number
 *  }
 * }
 */
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
