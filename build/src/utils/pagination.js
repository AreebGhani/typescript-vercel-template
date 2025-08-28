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
const paginate = async (model, options) => {
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
    let dataQuery = model.find(query).select(select).sort(sort).skip(skip).limit(limit);
    // Apply population if provided
    if (populate.length > 0) {
        populate.forEach(pop => {
            dataQuery = dataQuery.populate(pop); // Apply each populate individually
        });
    }
    const data = await dataQuery;
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
//# sourceMappingURL=pagination.js.map