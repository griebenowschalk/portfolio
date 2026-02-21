import type { Model } from "mongoose";

export interface PaginateOptions {
  page: number;
  limit: number;
  sort?: string;
  lean?: boolean;
}

export interface PaginateResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Run a paginated find + countDocuments in parallel. Use in list controllers.
 */
export async function paginate<T>(
  model: Model<T>,
  filter: Record<string, unknown>,
  options: PaginateOptions,
): Promise<PaginateResult<T>> {
  const { page, limit, sort = "", lean = false } = options;
  const skip = (page - 1) * limit;

  const findQuery = model.find(filter).sort(sort).skip(skip).limit(limit);
  const dataPromise = lean ? findQuery.lean() : findQuery;
  const [data, total] = await Promise.all([
    dataPromise as Promise<T[]>,
    model.countDocuments(filter),
  ]);

  return {
    data: data as T[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Parse page and limit from Express req.query with defaults.
 */
export function parsePaginationQuery(query: Record<string, unknown>, defaults = { page: 1, limit: 10 }) {
  const page = Math.max(1, Number(query.page) || defaults.page);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || defaults.limit));
  return { page, limit };
}
