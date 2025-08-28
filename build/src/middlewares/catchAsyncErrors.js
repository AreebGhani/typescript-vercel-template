/**
 ** A higher-order function that wraps an asynchronous function and catches any errors,
 * passing them to the next middleware (error handler).
 * @param theFunc - The asynchronous function to be wrapped.
 * @returns A function that executes the asynchronous function and catches any errors.
 * @example
 * const asyncHandler = catchAsyncErrors(async (req, res, next) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * });
 */
const catchAsyncErrors = (theFunc) => (req, res, next) => {
    // Execute the async function and catch any errors to pass to the error handler
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
export default catchAsyncErrors;
//# sourceMappingURL=catchAsyncErrors.js.map