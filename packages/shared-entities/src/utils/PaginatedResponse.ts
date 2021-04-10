export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  limit: number;
  offset: number;
}
