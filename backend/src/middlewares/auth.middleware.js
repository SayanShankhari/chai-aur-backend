import jwt from 'jsonwebtoken';

const verifyToken = (request, response, next) => {
	// 1. Get the token from the Authorization header
	const auth_header = request.headers ["authorization"];

	// Headers usually look like: "Bearer <token>"
	// const token = auth_header && auth_header.split(" ")[1];
	const token = auth_header?.split(" ")[1];	// optional chain

	// 2. If no token is provided, deny access
	if (!token) {
		return response.status(401).json (
			{
				success: false
				, message: "Access denied. No token provided!"
				, data: null
			}
		);
	}

	try {
		// 3. Verify the token using the secret key
		const decoded = jwt.verify (token, process.env.ACCESS_TOKEN_SECRET);

		// 4. Attach the decoded user payload (e.g., id, role) to the request object
		request.user = decoded;

		// 5. Pass control to the next middleware or controller
		next();
	} catch (error) {
		// 4. If the token is invalid, deny access
		return response.status(403).json (
			{
				success: false
				, message: `Invalid or expired token!: ${error.message}`
				, data: null
			}
		);
	}
}

export const authMiddleware = {
	verifyToken
};