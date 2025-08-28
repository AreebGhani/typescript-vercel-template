import type { DB } from '@/mongodb';

/**
 ** Interface representing the result of a paginated query.
 * @template T - The type of the items in the paginated result.
 * @property {boolean} success - Indicates whether the pagination operation was successful.
 * @property {Object} data - The data object containing pagination details and items.
 * @property {number} data.totalDocuments - The total number of documents available.
 * @property {number} data.totalPages - The total number of pages available.
 * @property {number} data.currentPage - The current page number.
 * @property {number} data.limit - The number of items per page.
 * @property {number} data.skip - The number of items to skip.
 * @property {T[]} data.items - The array of items for the current page.
 */
export interface PaginationResult<T> {
  success: boolean;
  data: {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    skip: number;
    items: T[];
  };
}

/**
 ** Interface representing the options for pagination.
 * @property {object} query - The query object to filter results.
 * @property {number} page - The page number to retrieve.
 * @property {number} limit - The number of items per page.
 * @property {string[]} select - The fields to include in the results.
 * @property {string | Record<string, SortOrder | { $meta: any }> | Array<[string, SortOrder]> | undefined | null} sort - The sorting criteria.
 * @property {Array<{ path: string; select?: string[] }>} populate - The fields to populate in the results.
 */
export interface PaginateOptions {
  query?: object;
  page?: number;
  limit?: number;
  select?: string[];
  sort?:
    | string
    | Record<string, DB.SortOrder | { $meta: any }>
    | Array<[string, DB.SortOrder]>
    | undefined
    | null;
  populate?: Array<{
    path: string;
    select?: string[];
  }>;
}

/**
 ** Paginates the results of a Mongoose model query.
 * @template T - The type of the document.
 * @param {Model<T>} model - The Mongoose model to query.
 * @param {PaginateOptions} options - The pagination options.
 *   - `page` - The page number to retrieve.
 *   - `limit` - The number of documents per page.
 *   - `query` - The query object to filter documents.
 *   - `select` - The fields to select in the documents.
 *   - `sort` - The sort order of the documents.
 *   - `populate` - The population options for the query.
 * @returns {Promise<PaginationResult<T>>} - A promise that resolves to the pagination result.
 */
const paginate = async <T extends DB.Document>(
  model: DB.Model<T>,
  options: PaginateOptions
): Promise<PaginationResult<T>> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const query = options.query ?? {};
  const select = options.select || [];
  const sort = options.sort ?? { createdAt: -1 };
  const populate = options.populate || [];

  // Get total count of documents matching the query
  const totalDocuments = await model.countDocuments(query);

  // Fetch data with optional population
  let dataQuery: any = model.find(query).select(select).sort(sort).skip(skip).limit(limit);

  // Apply population if provided
  if (populate.length > 0) {
    populate.forEach(pop => {
      dataQuery = dataQuery.populate(pop); // Apply each populate individually
    });
  }

  const data: T[] = await dataQuery;
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    success: true,
    data: {
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
      skip,
      items: data,
    },
  };
};

export default paginate;
