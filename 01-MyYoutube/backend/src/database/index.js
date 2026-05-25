import mongoose from "mongoose";
import { DB_NAME } from "../constants.mjs";

const connectDB = async () => {
	try {
		const response = await mongoose.connect (`${process.env.DB_URI}/${DB_NAME}`);
		console.log ("Database connected successfully!");
		console.log (`Database Host: ${response.connection.host}`);
	} catch (error) {
		console.error ("Database error: ", error);
		process.exit (1);
	}
}

export default connectDB;