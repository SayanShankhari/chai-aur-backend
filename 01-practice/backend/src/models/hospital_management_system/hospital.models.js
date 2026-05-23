import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema ({
	name: {
		type: String,
		required: true
	}
	, address: {
		type: String,
		required: true
	}
	, contactNumber: {
		type: String,
		required: true
	}
	, email: {
		type: String,
		required: true
	}
	, doctors: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Doctor"
		}
	]
	, treats: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Disease"
		}
	]
	, departments: [
		{
			type: String,
			required: true
		}
	]
});
	
const Hospital = mongoose.model ("Hospital", hospitalSchema);
export default Hospital;