import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
	username: {
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
		type: String
		, default: null
	}
	, coverImage: {
		type: String
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
// do not use arrow function here since we need access object context via 'this' which refers to the user document being saved
userSchema.pre ("save", async function (next) {
	if (!this.isModified ("password")) {	// to avoid re-hashing the password if it hasn't been changed
		return next ();
	}
	try {
		// const salt = await bcrypt.genSalt (10);
		// this.password = await bcrypt.hash (this.password, salt);
		const rounds = 10;
		this.password = await bcrypt.hash (this.password, rounds);
		next ();
	} catch (err) {
		next (err);
	}
});

// add custom instance methods to the user schema
userSchema.methods.isCorrectPassword = async function (given_password) {
	return await bcrypt.compare (given_password, this.password);
}
userSchema.methods.generateAccessToken = async function () {	// can omit async since jwt.sign is synchronous, but keeping it async for consistency and future-proofing
	const payload = {
		id: this._id
		, username: this.username
		, email: this.email
		, fullname: this.fullname
	};

	return jwt.sign (
		payload
		, process.env.ACCESS_TOKEN_SECRET
		, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
	);
}
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign (
		// payload
		{ id: this._id }
		// secretOrPrivateKey
		, process.env.REFRESH_TOKEN_SECRET
		// options
		, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
	);
}

export const User = model ("User", userSchema);