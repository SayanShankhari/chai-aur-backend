import mongoose from 'mongoose';

const { Schema } = mongoose;

const todoSchema = new Schema ({
	title: {
		type: String
		, required: true
	}
	, description: {
		type: String
		, required: true
	}
	, completed: {
		type: Boolean
		, default: false
	}
	, author: {
		type: Schema.Types.ObjectId
		, ref: 'User' // Reference to the "User" model
		, required: true
	}
	, subTodos: [
		{
			type: Schema.Types.ObjectId
			, ref: 'SubTodo' // Reference to the "SubTodo" model
		}
	]
}, { timestamps: true });

export const Todo = mongoose.model ('Todo', todoSchema);