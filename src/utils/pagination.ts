export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const parsePagination = (query: PaginationQuery): PaginationParams => {
  const page: number = Math.max(1, parseInt(query.page ?? "1", 10));
  const limit: number = Math.min(
    100,
    Math.max(1, parseInt(query.limit ?? "10", 10)),
  );
  const skip: number = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages: number = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
