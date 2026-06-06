import { ApiFailure } from "../utils/ApiFailure.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";


/**
 * Success Handler Attachment Middleware
 * Binds a clean helper directly to the Express response object.
 */
const successMiddleware = (_request, response, next) => {
	// If it's a structural ApiSuccess, use its defined status code, otherwise fallback to 200
	const status_code = 200;

	// Express automatically fires the internal .toJSON() overridden method defined in ApiSuccess and ApiError
	// return response.status (status_code).json (error);

	// bind a clean success handler with the express response object
	response.handleSuccess = (statusCode, responseData, responseMessage) => {
		const success_payload = new ApiSuccess (statusCode, responseData, responseMessage);
		return response.status (status_code).json (success_payload);
	};

	next();
};

/**
 * Global Error Handling Middleware
 * Catches all thrown ApiFailures and standardises the API client response.
 */
const failureMiddleware = (error, _request, response, _next) => {
	// If it's a structural ApiFailure, use its defined status code, otherwise fallback to 500
	const status_code = error.statusCode || 500;

	// set a checked error
	let client_error = error;

	// Handle unexpected system crashes safely so the client still gets a structured JSON
	if (!(error instanceof ApiFailure)) {
		client_error = new ApiFailure (
			500
			, process.env.NODE_ENV === 'development' ? error.message : "Internal Server Error"
			, []
			, error.stack
		);
	}

	// Express automatically fires the internal .toJSON() method in to ApiSuccess and ApiError
	return response.status (status_code).json (client_error);
};


export const responseMiddleware = {
	successMiddleware
	, failureMiddleware
};