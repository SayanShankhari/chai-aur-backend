import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { async_handler } from "../utils/async_handler.js";
import { ApiFailure } from "../utils/ApiFailure.js";

// const verifyToken = async_handler (async (_error, request, _response, next) => {
// using error handling middleware shifts the input to wrong fields
// _error<=request, request<=response, _response<=next, next<=undefined
const verifyToken = async_handler (async (request, _response, next) => {
	// 1. Get the token from the Authorization header
	// headers:
	// Authorization: Passwords, API keys, or security bearer tokens to verify who you are
	// User-Agent: Information regarding the client app, browser type, or operating system
	// Accept-Language: Tells the server your preferred translation dialect (e.g., en-US)
	// Cookie: Passes previously stored state parameters back to the hosting server

	// request.headers ["Authorization"] -> direct access, case sensitive, alias unsafe
	// request.header ("Authorization") -> handled access, case insensitive, alias safe

	try {
		const token =
			request.cookies?.accessToken ||
			request.header ("Authorization")?.replace ("Bearer", "").trim();

		if (!token) {
			throw new ApiFailure (401, "Unauthorized request!");
		}

		const decoded_data = jwt.verify (token, process.env.JWT_ACCESS_SECRET);

		const user = await User.findById (decoded_data?._id).select(
			"-password -accessToken"
		);

		if (!user) {
			// TODO: frontend
			throw new ApiFailure (401, "Invalid access token!");
		}

		// verified
		request.user = user; // add/set/glue new property to request

		next(); // mark as complete and transfer control
	} catch (error) {
		throw new ApiFailure (401, error?.message || "Something went wrong verifying access token!");
	}
});

// const verifyToken = (_error, request, response, next) => {
// 	// 1. Get the token from the Authorization header
// 	const auth_header = request.headers ["authorization"];

// 	// Headers usually look like: "Bearer <token>"
// 	// const token = auth_header && auth_header.split(" ")[1];
// 	const token = auth_header?.split(" ")[1];	// optional chain

// 	// 2. If no token is provided, deny access
// 	if (!token) {
// 		return response.status(401).json (
// 			{
// 				success: false
// 				, message: "Access denied. No token provided!"
// 				, data: null
// 			}
// 		);
// 	}

// 	try {
// 		// 3. Verify the token using the secret key
// 		const decoded = jwt.verify (token, process.env.ACCESS_TOKEN_SECRET);

// 		// 4. Attach the decoded user payload (e.g., id, role) to the request object
// 		request.user = decoded;

// 		// 5. Pass control to the next middleware or controller
// 		next();
// 	} catch (error) {
// 		// 4. If the token is invalid, deny access
// 		return response.status(403).json (
// 			{
// 				success: false
// 				, message: `Invalid or expired token!: ${error.message}`
// 				, data: null
// 			}
// 		);
// 	}
// }

export const authMiddleware = {
	verifyToken
};
