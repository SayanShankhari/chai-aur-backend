import { async_handler } from "../utils/async_handler.js";
import { User } from "../models/user.model.js";
import { ApiFailure } from "../utils/ApiFailure.js";
import { ApiSuccess } from "../utils/ApiSuccess.js";
import { cloudinaryService } from "../services/cloudinary.service.js";


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
	try {
		// find user with id
		const user = await User.findById (user_id);

		// generate tokens
		const access_token = user.generateAccessToken();
		const refresh_token = user.generateRefreshToken();

		// add to database
		user.accessToken = access_token;
		user.refreshToken = refresh_token;

		// save to database
		await user.save ( { validateBeforeSave: false } );

		return {
			accessToken: access_token
			, refreshToken: refresh_token
		};
	} catch (error) {
		throw new ApiFailure (500, "Something went wrong while generating access/refresh token!");
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

	// find the user id
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
	const logged_in_user = await User.findById (user._id)
		.select ("-password -refreshToken");

	// send cookie (secure)
	const cookie_options = {
		httpOnly: true
		, secure: true
	};	// modifiable only inside server

	return response
		.status (200)
		.cookie ("accessToken", accessToken, cookie_options)
		.cookie ("refreshToken", refreshToken, cookie_options)
		.json (
			new ApiSuccess (
				200
				, {
					user: logged_in_user
					, accessToken
					, refreshToken
				}
				, "User logged in successfully!"
			)
		);

});

const logoutUser = async_handler (async (request, response) => {
	await User.findByIdAndUpdate (
		request.user._id	// user property is glued to request via auth middleware
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
		.clearCookie (accessToken, cookie_options)
		.clearCookie (refreshToken, cookie_options)
		.json (
			new ApiResponse (
				200
				, {}	// empty object
				, "User logged out successfully!"
			)
		);
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

const getMyProfile = async_handler (async (request, response) => {
	try {
		// request.user.id comes directly from the verified JWT token payload
		const user = await User.findById (request.user.id).select('-password'); // Exclude password from response

		if (!user) {
			return response.status(404).json (
				{
					success: false
					, message: "User not found!"
					, data: null
				}
			);
		}

		response.status(200).json (
			{
				success: true
				, message: "Profile found successfully!"
				, data: user
			}
		);
	} catch (error) {
		response.status(500).json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});


export const userController = {
	registerUser
	, getAllUsers
	, getUserById
	, updateUser
	, deleteUser
	, getMyProfile
	, loginUser
	, logoutUser
};