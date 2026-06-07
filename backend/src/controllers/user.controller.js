import { async_handler } from "../utils/async_handler.js";
import { User } from "../models/user.model.js";
import { ApiFailure } from "../utils/ApiFailure.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { cloudinaryService } from "../services/cloudinary.service.js";
import jwt from "jsonwebtoken";


const registerUser = async_handler (async (request, response) => {
	// get user details from frontend
	const { fullName, username, email, password } = request.body;
	console.log (request.body);

	// validation - not empty
	if (
		[fullName, username, email, password] .some ((field, _index, _array) => (
			field === undefined || field.trim () === ""
		))
	) {
		throw new ApiFailure (400, "All fields are required and cannot be empty!");
	}
	// validation - proper email format
	if (!email.includes ("@")) {
		throw new ApiFailure (400, "Please provide a valid email address!");
	}

	// check if user already exists - username, email
	const existing_user = await User.findOne ( { $or: [{ username }, { email }] } );

	if (existing_user) {
		throw new ApiFailure (409, "User with this email or username already exists!");
	}

	// get the local paths for avatar and cover image
	// multer middleware adds files properties to request object like express provided request.body
	const avatar_local_path = request.files?.avatar[0]?.path;
	const banner_local_path = request.files?.banner[0]?.path;

	// check for images and avatar
	if (!avatar_local_path) {
		throw new ApiFailure (400, "Avatar image is required!");
	}
	if (!banner_local_path) {
		throw new ApiFailure (400, "Cover image is required!");
	}

	// upload to cloudinary
	const avatar_upload_response = await cloudinaryService.uploadOnCloudinary (avatar_local_path);
	const avatar_URL = avatar_upload_response?.url || "";
	const banner_upload_response = await cloudinaryService.uploadOnCloudinary (banner_local_path);
	const banner_URL = banner_upload_response?.url || "";

	// TODO: check if avatar is uploaded successfully via multer
	if (!avatar_URL) {
		throw new ApiFailure (400, "Avatar upload failed!");
	}
	if (!banner_URL) {
		await new ApiFailure (400, "Banner upload error!");
	}

	// get the URL from response and save to database
	// create user object - create database entry
	const user = await User.create (
		{
			fullName
			, username: username.toLowerCase()
			, email
			, password
			, avatar: avatar_URL.url
			, banner: banner_URL.url
		}
	);

	// if (!user) {
	// 	throw new ApiFailure (500, "Something went wrong registering the user!");
	// }

	// check for user creation response
	// remove password and refresh token from response
	const created_user = await User.findById (user._id)
		.select ("-password -refreshToken");	// avoid selecting mentioned ones

	if (!created_user) {
		throw new AppError (500, "Something went wrong registering the user!");
	}

	// send response to frontend
	return response.status (201).json (
		new ApiResponse (200, created_user, "User registered successfully!")
	);


// DON'T JUST:
	// try {
	// 	const new_user = new User (request.body);
	// 	const saved_user = await new_user.save ();

	// 	response.status (201) .json (
	// 		{
	// 			success: true
	// 			, message: "User registered successfully!"
	// 			, data: saved_user
	// 		}
	// 	);
	// } catch (error) {
	// 	response.status (400) .json (
	// 		{
	// 			success: false
	// 			, message: error.message
	// 			, data: null
	// 		}
	// 	);
	// }
});

const generateAccessAndRefreshTokens = async (user_id) => {
	// async_handler is not required; as we are not handling web api request
	// DO NOT call from outside unless checked
	// console.log ("user_id: ", user_id);

	try {
		// 1. find user with id
		const user = await User.findById (user_id);
		// console.log ("user: ", user);
		// no need to check user's existence as the flow already checked it

		// 2. generate tokens
		const access_token = await user.generateAccessToken();
		// console.log ("accessToken: ", access_token);
		const refresh_token = await user.generateRefreshToken();
		// console.log ("refreshToken: ", refresh_token);

		// 3. add to database
		// no need to save access token to database
		// user.accessToken = access_token;
		user.refreshToken = refresh_token;
		// console.log ("Final User with refreshToken:", user);

		// "save" to database (mongodb pre hook utility, defined inside user model)
		// IN"validateBeforeSave" to avoid password mandate
		// no need to access return value
		await user.save ( { validateBeforeSave: false } );

		return (
			{
				accessToken: access_token
				, refreshToken: refresh_token
			}
		);
	} catch (error) {
		throw new ApiFailure (
			500
			, "Something went wrong while generating access/refresh token!"
			, [error]
			, (process.env.NODE_ENV === "dev") ? error.stack : undefined
			, null
		);
	}
}

const loginUser = async_handler (async (request, response) => {
	// check and sanitize input
	const { username, email, password } = request.body;

	// based on username or email
	// if (!(username || email)) {
	if (!username && !email) {
		throw new ApiFailure (400, "Username or Email is required!");
	}

	// find the user id [aggregation pipeline]
	const user = await User.findOne (
		{
			$or: [ {username}, {email} ]
		}
	);

	if (!user) {
		throw new ApiFailure (404, "User not found!");
	}

	// match password
	const match_status = await user.isCorrectPassword (password);

	if (!match_status) {
		throw new ApiFailure (401, "Invalid user credentials!");
	}

	// check access and refresh token
	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens (user._id);

	// TODO: refine the multiple fetch
	const logged_in_user = await User.findById (user._id).select ("-password -refreshToken");

	// send cookie (secure)
	const cookie_options = {
		httpOnly: true
		, secure: true
	};	// "httpOnly" & "secure" to modify only inside backend (server)

	return response
		.status (200)
		.cookie ("accessToken", accessToken, cookie_options) // (key, value, options)
		.cookie ("refreshToken", refreshToken, cookie_options)
		.json (
			new ApiSuccess (
				200
				, "User logged in successfully!"
				, {
					user: logged_in_user
					, accessToken
					, refreshToken
				}
			)
		);
});

const logoutUser = async_handler (async (request, response) => {
	await User.findByIdAndUpdate (
		request.user._id	// "user" model property is glued to request via auth middleware
		, {
			$set: {
				refreshToken: undefined
			}
		}, {
			new: true	// response is newly updated
		}
	);

	const cookie_options = {
		httpOnly: true
		, secure: true
	}

	return response
		.status (200)
		.clearCookie ("accessToken", cookie_options)
		.clearCookie ("refreshToken", cookie_options)
		.json (
			new ApiSuccess (
				200
				, "User logged out successfully!"
				, {}	// empty payload object
			)
		);

	// 204 means success without any response content
	// return response
	// 	.status (204)
	// 	.clearCookie ("accessToken", cookie_options)
	// 	.clearCookie ("refreshToken", cookie_options)
	// 	);
});

const getAllUsers = async_handler (async (_request, response) => {
	try {
		const users = await User.find ();

		response.status (200) .json (
			{
				success: true
				, message: "All users found successfully!"
				, data: users
			}
		);
	} catch (error) {
		response.status (500) .json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});

const getUserById = async_handler (async (request, response) => {
	try {
		const user = await User.findById (request.params.id);
		if (!user) {
			return response.status (404) .json (
				{
					success: false
					, message: "User not found!"
					, data: null
				}
			);
		}
		response.status (200) .json (
			{
				success: true
				, message: "User found successfully!"
				, data: user
			}
		);
	} catch (error) {
		response.status (500) .json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});

const updateUser = async_handler (async (request, response) => {
	try {
		const updated_user = await User.findByIdAndUpdate (
			request.params.id
			, request.body
			, {
				new: true
				, runValidators: true	// Returns the modified doc and runs checks
			}
		);
		if (!updated_user) {
			return response.status (404) .json (
				{
					success: false
					, message: "User not found! Update failed!"
					, data: null
				}
			);
		}
		response.status (200) .json (
			{
				success: true
				, message: "User updated successfully!"
				, data: updated_user
			}
		);
	} catch (error) {
		response.status (400) .json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});

const deleteUser = async_handler (async (request, response) => {
	try {
		const deleted_user = await User.findByIdAndDelete (request.params.id);
		if (!deleted_user) {
			return response.status (404) .json (
				{
					success: false
					, message: "User not found! Deletion failed!"
					, data: null
				}
			);
		}
		response.status (200) .json (
			{
				success: true
				, message: "User deleted successfully!"
				, data: deleted_user
			}
		);
	} catch (error) {
		response.status (500) .json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});

const refreshAccessToken = async_handler (async (request, response) => {
	const incoming_refresh_token = request.cookies.refreshToken || request.body.refreshToken;

	if (!incoming_refresh_token) {
		throw new ApiFailure (401, "Unauthorized request! Missing auth token!");
	}

	try {
		// automatically throws error
		const decoded_token_data = jwt.verify (
			incoming_refresh_token
			, process.env.JWT_REFRESH_SECRET
		);
	
		const user = await User.findById (decoded_token_data?._id);
	
		if (!user) {
			throw new ApiFailure (404, "User not found!");
		}
	
		if (incoming_refresh_token !== user.refreshToken) {
			throw new ApiFailure (401, "Invalid/Expired refresh token!");
		}
	
		const { accessToken, refreshToken } = generateAccessAndRefreshTokens (user._id);
	
		const cookie_options = {
			httpOnly: true
			, secure: true
		};
	
		return response
			.status (200)
			.cookie ("accessToken", accessToken, cookie_options)
			.cookie ("refreshToken", refreshToken, cookie_options)
			.json (
				new ApiSuccess (
					200
					, "Refreshed access token!"
					, {
						accessToken
						, refreshToken
					}
				)
			);
	} catch (error) {
		throw new ApiFailure (
			501
			, error?.message || "Failed to refresh access token!"
		);
	}
});

const updatePassword = async_handler (async (request, response) => {
	const { oldPassword, newPassword } = request.body;

	if (!oldPassword || !newPassword) {
		throw new ApiFailure (404, "Password not provided!");
	}

	const user = await User.findById (request.user?._id);

	if (!user) {
		throw new ApiFailure (400, "User info not found!");
	}

	const password_matched = await user.isCorrectPassword (oldPassword);

	if (!password_matched) {
		throw new ApiFailure (400, "Invalid old password!");
	}

	user.password = newPassword;
	await user.save ( { validateBeforeSave: false } );	// call pre hook

	return response
		.status (200)
		.json (
			new ApiSuccess (
				200
				, "Password changed successfully!"
				, {}
			)
		);
});

const getUser = async_handler (async (request, response) => {
	try {
		// request.user.id comes directly from the verified JWT token payload
		const user = await User.findById (request.user?._id).select ("-password"); // Exclude password from response

		if (!user) {
			throw new ApiFailure (400, "User not found! Please log in!");
		}

		return response
		.status (200)
		.json (
			new ApiSuccess (
				200
				, "Profile found successfully!"
				, user
			)
		);
	} catch (error) {
		throw new ApiFailure (500, error?.message || "User not found!", [], error?.stack, null);
	}
});

const updateAccountDetails = async_handler (async (request, response) => {
	const { fullName, email } = request.body;

	if (!fullName || !email) {
		throw new ApiFailure (400, "All fields are required!");
	}

	const user = User.findByIdAndUpdate (
		request.user?._id
		, {
			$set: {
				fullName, email
			}
		}, {
			new: true
		}
	).select ("-password");

	return response
		.status (200)
		.json (
			new ApiSuccess (
				200
				, "Account details updated successfully!"
				, user
			)
		);
});

const updateUserAvatar = async_handler (async (request, response) => {
	const avatar_local_path = request.file?.path;

	if (!avatar_local_path) {
		throw new ApiFailure (400, "Avatar file is missing!");
	}

	const avatar = await cloudinaryService.uploadOnCloudinary (avatar_local_path);

	if (!avatar.url) {
		throw new ApiFailure (400, "Error uploading avatar to cloudinary!");
	}

	await User.findByIdAndUpdate (
		request.user?._id
		, {
			$set: {
				avatar: avatar.url
			}
		}
		, { new: true }
	).select ("-password");

	return response
		.status (200)
		.json (
			new ApiSuccess (
				200
				, "Avatar updated successfully!"
				, avatar.url
			)
		);
});

const updateUserBanner = async_handler (async (request, response) => {
	const banner_local_path = request.file?.path;

	if (!banner_local_path) {
		throw new ApiFailure (400, "Banner file is missing!");
	}

	const banner = await cloudinaryService.uploadOnCloudinary (banner_local_path);

	if (!banner.url) {
		throw new ApiFailure (400, "Error uploading avatar to cloudinary!");
	}

	await User.findByIdAndUpdate (
		request.user?._id
		, {
			$set: {
				banner: banner.url
			}
		}
		, { new: true }
	).select ("-password");

	return response
		.status (200)
		.json (
			new ApiSuccess (
				200
				, "Banner updated successfully!"
				, banner.url
			)
		);
});


export const userController = {
	registerUser
	, getAllUsers
	, getUserById
	, updateUser
	, deleteUser
	, getUser
	, loginUser
	, logoutUser
	, refreshAccessToken
	, updatePassword
	, updateAccountDetails
	, updateUserAvatar
	, updateUserBanner
};