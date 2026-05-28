import { Schema, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
	title: {
		type: String
		, required: [true, "Title is required"]
	}
	, description: {
		type: String
		, required: [true, "Description is required"]
	}
	, url: {
		type: String
		, required: [true, "URL is required"]
	}
	, thumbnailUrl: {
		type: String
	}
	, duration: {
		type: Number
		, required: [true, "Duration is required"]
	}
	, videoFile: {
		type: String
		, required: [true, "Video file is required"]
	}
	, views: {
		type: Number
		, default: 0
	}
	, isPublished: {
		type: Boolean
		, default: false
	}
	, owner: {
		type: Schema.Types.ObjectId
		, ref: "User"
		, required: [true, "Owner is required"]
	}
}, { timestamps: true });

videoSchema.plugin (mongooseAggregatePaginate);

const Video = model ("Video", videoSchema);

export default Video;