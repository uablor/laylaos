export interface IPagination {
  total: number;
  count: number;
  limit: number;
  totalPages: number;
  currentPage: number;
}
export interface PaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}