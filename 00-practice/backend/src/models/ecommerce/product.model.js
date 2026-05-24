import { Schema, model } from 'mongoose';

const productSchema = new Schema ({
	name: {
		type: String
		, required: true
	}
	, description: {
		type: String
		, required: true
	}
	, images: [
		{
			type: String
			, publicURL: String
		}
	]
	, price: {
		type: Number
		, required: true
	}
	, stock: {
		type: Number
		, default: 0
	}
	, category: {
		type: Schema.Types.ObjectId
		, ref: 'Category'
		, required: true
	}
	, owner: {
		type: Schema.Types.ObjectId
		, ref: 'User'
		, required: true
	}
}, { timestamps: true, });

export const Product = model ('Product', productSchema);