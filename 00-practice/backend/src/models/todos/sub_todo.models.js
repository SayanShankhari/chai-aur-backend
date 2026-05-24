import mongoose from 'mongoose';

const subTodoSchema = new mongoose.Schema ({
	// can write "title: String", but we want to add more properties to it, so we use an object
	title: {
		type: String
		, required: true
		, unique: true
	}
	, complete: {
		type: Boolean
		, default: false
	}
	, author: {
		type: mongoose.Schema.Types.ObjectId
		, ref: 'User' // Reference to the "User" model
		, required: true
	}
});

export const SubTodo = mongoose.model ('SubTodo', subTodoSchema);