class ApiError extends Error {
	constructor (
		status_code
		, message="Something went wrong!"	// most disliked general message
		, errors = []
		, stack = ""
		, data = {}
	) {
		super (message);	// override the message property of the Error class with our custom message

		this.code = status_code;
		this.data = data;
		this.message = message;
		this.success = status_code >= 200 && status_code < 400;	// success if status code is in the range of 200-299
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace (this, this.constructor);
		}
	}
}

export { ApiError };