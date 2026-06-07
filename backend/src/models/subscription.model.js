import { Schema, model } from "mongoose";


const subscriptionSchema = new Schema ({
	subscriber: {	// who is subscribing
		type: Schema.Types.ObjectId
		, ref: "User"
	}
	, channel: {	// to whom to subscribe
		type: Schema.Types.ObjectId
		, ref: "User"
	}
}, { timestamps:true });


export const Subscription = model ("Subscription", subscriptionSchema);