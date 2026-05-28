import { async_handler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken";

const refreshToken = async_handler (async (req, res) => {
	// Get refresh token from HttpOnly cookies
	const refresh_token = req.cookies?.refreshToken; 

	if (!refresh_token) {
		return res.status(401).json({ message: 'Refresh token missing.' });
	}

	try {
		// ONLY use Refresh Secret here
		const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

		// Optional: Check if token exists in database (to allow revoking/logout)
		const existing_refresh_token = await TokenModel.findOne (
			{ token: refresh_token }
		);

		// Generate a brand new, short-lived access token
		const new_access_token = jwt.sign (
			{ id: decoded.id, role: decoded.role }
			, process.env.ACCESS_TOKEN_SECRET
			, { expiresIn: '15m' } // Short life
		);

		response.status(200).json({ accessToken: new_access_token });
	} catch (error) {
		response.status(403).json({ message: 'Invalid or expired refresh token. Please login again.' });
	}
});

export const authController = {
	refreshToken
};