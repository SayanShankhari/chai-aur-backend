import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema ({
	name: {
		type: String
		, required: true
	},
	specialization: {
		type: String
		, required: true
	}
	, qualifications: {
		type: [String]
		, required: true
	}
	, experience: {
		type: Number
		, required: true
	}
	, specialiedIn: [
		{
			type: mongoose.Schema.Types.ObjectId
			, ref: "Disease"
		}
	]
	, hospitals: [
		{
			type: mongoose.Schema.Types.ObjectId
			, ref: "Hospital"
		}
	]
	, contactNumber: {
		type: String
		, required: true
	},
	email: {
		type: String
		, required: true
	}
});

const Doctor = mongoose.model ("Doctor", doctorSchema);

export default Doctor;