import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema ({
	username: {
		type: String
		, required: true
		, unique: true
	}
	, email: {
		type: String
		, required: true
		, unique: true
		, lowercase: true
	}
	, password: {
		type: String
		, required: true
		, min: [8, 'Password must be at least 8 characters long']
		, max: [32, 'Password must be less than 32 characters long']
	}
}, {
	// automates createdAt and updatedAt fields
	timestamps: true
});

export const User = model ('User', userSchema);