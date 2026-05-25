class ApiError extends Error {
	constructor (
		status_code
		, message="Something went wrong!"	// most disliked general message
		, errors = []
		, stack = ""
	) {
		super (message);	// override the message property of the Error class with our custom message

		this.code = status_code;
		this.data = null;
		this.message = message;
		this.success = false;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace (this, this.constructor);
		}
	}
}

export { ApiError };