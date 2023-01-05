export interface Pagination {
  perPage: number;
  totalElements: number;
  currentPage: number;
  hasPreviousPage: boolean;
  previousPage: number;
  hasNextPage: boolean;
  nextPage: number;
  totalPages: number;
  items: any[];
}
