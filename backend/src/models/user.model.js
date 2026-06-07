import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";


const userSchema = new Schema ({
	fullName: {
		type: String
		, required: [true, "Full Name is required"]
	}
	, username: {
		type: String
		, required: [true, "Username is required"]
		, unique: true
		, trim: true
		, lowercase: true
		, index: true
	}
	, password: {
		type: String
		, required: [true, "Password is required"]
	}
	, email: {
		type: String
		, required: [true, "Email is required"]
		, unique: true
		, index: true
	}
	, avatar: {
		type: String	// cloudinary URL
		, default: null
	}
	, banner: {
		type: String	// cloudinary URL
		, default: null
	}
	, watchHistory: [
		{
			type: Schema.Types.ObjectId
			, ref: "Video"
		}
	]
	, refreshToken: {
		type: String
	}
}, { timestamps: true });

// add pre-save middleware hook
// do not use arrow function here since arrow function lacks 'this' object context
// if it was a synchronous function only one data parameter is required
// it is an asynchronous function, hence two parameters are required
userSchema.pre ("save", async function () {
	// if (this.isModified ("password")) {
	// 	try {
	// 		// const salt = await bcrypt.genSalt (10);
	// 		// this.password = await bcrypt.hash (this.password, salt);
	// 		const rounds = 10;
	// 		this.password = await bcrypt.hash (this.password, rounds);
	// 		next();	// move control forward in the chain
	// 	} catch (error) {
	// 		// throw error;
	// 		next (error);	// propagate the error forward in the chain
	// 	}
	// } else if (this.isModified ("refreshToken")) {
	// 	// this.refreshToken = 
	// } else {
	// 	// to avoid re-hashing the password/refreshToken if it hasn't been changed
	// 	return next();	// returns control back
	// }

	if (
		!this.isModified ("password")
		&& !this.isModified ("refreshToken")
	) {
		// to avoid re-hashing the password/refreshToken if it hasn't been changed
		return next();	// returns control back
	}
	if (this.isModified ("password")) {
		try {
			// const salt = await bcrypt.genSalt (10);
			// this.password = await bcrypt.hash (this.password, salt);
			const rounds = 10;
			this.password = await bcrypt.hash (this.password, rounds);
			next();	// move control forward in the chain
		} catch (error) {
			// throw error;
			next (error);	// propagate the error forward in the chain
		}
	}
});

// bind custom instance methods to the user schema
userSchema.methods.isCorrectPassword = async function (given_password) {
	return await bcrypt.compare (given_password, this.password);
}
userSchema.methods.generateAccessToken = async function () {	// can omit async since jwt.sign is synchronous, but keeping it async for consistency and future-proofing
	const payload = {
		id: this._id
		// optionally included:
		, username: this.username
		, email: this.email
		, fullname: this.fullname
	};

	return jwt.sign (
		payload
		// secretOrPrivateKey
		, process.env.JWT_ACCESS_SECRET
		// options
		, { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" }
	);
}
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign (
		// payload
		{ id: this._id }
		// secretOrPrivateKey
		, process.env.JWT_REFRESH_SECRET
		// options
		, { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" }
	);
}


export const User = model ("User", userSchema);