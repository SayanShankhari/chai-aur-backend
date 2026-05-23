import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema ({
	name: {
		type: String,
		required: true
	}
	, symptoms: [
		{
			type: String,
			required: true
		}
	]
	, treatments: [
		{
			type: String,
			required: true
		}
	]
	, medicins: [
		{
			type: String,
			required: true
		}
	]
});

const Disease = mongoose.model ("Disease", diseaseSchema);
export default Disease;