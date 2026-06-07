// function async_handler (fn) {
// 	return (req, res, next) => {
// 		Promise.resolve (fn (req, res, next)).catch(next);
// 	};
// }


/**
 * a higher order function to handle asynchronous request
 * 
 * @param {Function} handler - async function as input
 * @returns {void}
 */
const async_handler = (handler) => {
	return ((request, response, next) => {
		Promise.resolve (handler (request, response, next))
		.catch ((err) => next (err));
	});
}

// alternative traditional way:
// const async_handler = (handler) => async (error, request, response, next) => {
// 	try {
// 		await handler (error, request, response, next);
// 	} catch (err) {
// 		response.status (error.code || 500) .json (
// 			{
// 				success: false
// 				, message: error.message || "Internal Server Error"
// 				, data: null
// 				, error: process.env.NODE_ENV === "development" ? err : undefined
// 			}
// 		);
// 	}
// };


export { async_handler };