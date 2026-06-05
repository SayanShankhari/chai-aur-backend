import { async_handler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken";


const refreshToken = async_handler (async (request, response) => {
	// Get refresh token from HttpOnly cookies
	const refresh_token = request.cookies?.refreshToken; 

	if (!refresh_token) {
		return response.status(401).json ( { message: 'Refresh token missing.' } );
	}

	try {
		// ONLY use Refresh Secret here
		const decoded = await jwt.verify (refresh_token, process.env.JWT_REFRESH_SECRET);

		// Optional: Check if token exists in database (to allow revoking/logout)
		const existing_refresh_token = await TokenModel.findOne (
			{ token: refresh_token }
		);

		// Generate a brand new, short-lived access token
		const new_access_token = jwt.sign (
			// payload:
			{ id: decoded.id, role: decoded.role }
			// secretOrPrivateKey:
			, process.env.JWT_ACCESS_SECRET
			// options:
			, { expiresIn: '15m' } // Short life
		);

		response.status(200).json ( { accessToken: new_access_token } );
	} catch (error) {
		response.status(403).json ( { message: 'Invalid or expired refresh token. Please login again.' } );
	}
});


export const authController = {
	refreshToken
};