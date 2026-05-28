import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema ({
	username: {
		type: String
		, required: true
		, unique: true
		, lowercase: true
		, min: [8, 'Username must be at least 8 characters long']
		, max: [16, 'Username must be less than 16 characters long']
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
}, { timestamps: true });

const User = model ('User', userSchema);

export default User;