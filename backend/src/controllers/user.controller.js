import { async_handler } from "../utils/async_handler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
		throw new ApiError (400, "All fields are required and cannot be empty!");
	}
	// validation - proper email format
	if (!email.includes ("@")) {
		throw new ApiError (400, "Please provide a valid email address!");
	}

	// check if user already exists - username, email
	const existing_user = await User.findOne ( { $or: [{ username }, { email }] } );

	if (existing_user) {
		throw new ApiError (409, "User with this email or username already exists!");
	}

	// get the local paths for avatar and cover image
	// multer middleware adds files properties to request object like express provided request.body
	const avatar_local_path = request.files?.avatar[0]?.path;
	const banner_local_path = request.files?.banner[0]?.path;

	// check for images and avatar
	if (!avatar_local_path) {
		throw new ApiError (400, "Avatar image is required!");
	}
	if (!banner_local_path) {
		throw new ApiError (400, "Cover image is required!");
	}

	// upload to cloudinary
	const avatar_upload_response = await cloudinaryService.uploadOnCloudinary (avatar_local_path);
	const avatar_URL = avatar_upload_response?.url || "";
	const banner_upload_response = await cloudinaryService.uploadOnCloudinary (banner_local_path);
	const banner_URL = banner_upload_response?.url || "";

	// TODO: check if avatar is uploaded successfully via multer
	if (!avatar_URL) {
		throw new ApiError (400, "Avatar upload failed!");
	}
	if (!banner_URL) {
		await new ApiError (400, "Banner upload error!");
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
	// 	throw new ApiError (500, "Something went wrong registering the user!");
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
};