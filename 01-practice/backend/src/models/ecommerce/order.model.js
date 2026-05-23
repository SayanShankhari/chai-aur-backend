import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema ({
	price: {
		type: Number
		, required: true
	}
	, buyer: {
		type: mongoose.Schema.Types.ObjectId
		, ref: 'User'
		, required: true
	}
	, seller: {
		type: mongoose.Schema.Types.ObjectId
		, ref: 'User'
		, required: true
	}
	, items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId
				, ref: 'Product'
			}
			, quantity: {
				type: Number
				, required: true
			}
			, required: true
		}
	]
	, address: {
		type: String
		, required: true
	}
	, status: {
		type: String
		, enum: [ "PENDING", "ORDERED", "CANCELLED", "SHIPPED", "COMPLETED" ]
		, default: "PENDING"
	}
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;