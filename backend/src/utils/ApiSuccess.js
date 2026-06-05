/**
 * Utility wrapper for all successful API operations.
 */
class ApiSuccess {
	 /**
	 * @param {number} statusCode - HTTP success code (e.g., 200, 201)
	 * @param {string} [successMessage="Success"] - Optional success description
	 * @param {any} [payloadData=null] - Optional payload or resource to return to the client
	 */
	constructor (statusCode, successMessage, payloadData = null) {
		this.status_code = statusCode;
		this.success_message = successMessage;
		this.payload_data = payloadData;
		this.success = statusCode >= 200 && statusCode < 400;	// success if status code is in the range of 200-399
	}

	/**
	 * Overrides native serialization to output clean camelCase for the client.
	 */
	toJSON() {
		return {
			success: this.success
			, statusCode: this.status_code
			, successMessage: this.success_message
			, payloadData: this.payload_data
		};
    }
}


export { ApiSuccess };