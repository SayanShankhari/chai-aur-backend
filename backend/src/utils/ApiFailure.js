/**
 * Custom API error handler for formatting server error responses.
 * (This plain text acts as your brief/details natively in JS)
 */
class ApiFailure extends Error {
	/**
	 * @param {number} statusCode - HTTP status codes (e.g., 400, 401, 404, 500)
	 * @param {string} errorMessage - User-friendly error summary
	 * @param {Array} [errorList=[]] - List of specific structural or form validation errors
	 * @param {string} [errorStack=undefined] - Optional Error stack trace for deep debugging
	 * @param {Object} [payloadData=null] - Optional payload data to deliver to user
	 */
	constructor (
		statusCode
		, errorMessage="Something went wrong!"	// most disliked general message
		, errorList = []
		, errorStack = undefined
		, payloadData = null
	) {
		super (errorMessage);	// override the message property of the Error class with incoming message

		this.status_code = statusCode;
		this.error_message = errorMessage;
		this.error_list = errorList;
		// this.payload_data = null; // Explicitly null to maintain payload shape
		this.payload_data = payloadData; // Explicitly null to maintain payload shape
		this.success = statusCode >= 200 && statusCode < 400;	// success if status code is in the range of 200-299

		if (errorStack) {
			this.stack = errorStack;
		} else {
			// creates .stack property
			Error.captureStackTrace (this, this.constructor);
		}
	}

	// @Override
	toJSON() {
		// stringify the keys to match globally accepted JSON format
		return {
			"success": false
			, "statusCode": this.status_code
			, "errorMessage": this.error_message
			, "errorList": this.error_list
			, "payloadData": this.payload_data
			// send error stack only in development environment
			, "errorStack": process.env.NODE_ENV === "dev" ? this.stack : undefined
		}
	}
}


export { ApiFailure };