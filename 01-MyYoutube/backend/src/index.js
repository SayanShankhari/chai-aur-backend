// import all env variables from .env file, and add them to process.env object, so that we can access them using process.env.VARIABLE_NAME
// require ('dotenv').config ({ path: "../.env" });	// approach-1: using require, commonjs module system
import dotenv from "dotenv";
import connectDB from "./database/index.js"; // using actual file name is mandatory for module js

import express from "express";
import cors from "cors";

dotenv.config ({ path: "../.env" });

const port = process.env.PORT || 3000;
const app = express ();

connectDB ()
.then (() => {
	app.listen (port, () => {
		console.log (`Server is running on port ${port}`);
	});

	app.on ("error", (error) => {
		throw error;
	});
})
.catch ((error) => {
	console.error ("Error: ", error);
});

/*
// approach-1:
import mongoose from "mongoose";
import { DB_NAME } from "./constants.mjs";

// async iffe (immediately invoked function expression), self invoking self executing function
// puts semicolon at the beginning to prevent issues with concatenation of scripts, if the previous script doesn't end with a semicolon, it will cause an error
;(async () => {
	try {
		mongoose.connect (`${process.env.DB_URI}/${DB_NAME}`);

		app.listen (port, () => {
			console.log (`Server is running on port ${port}`);
		});

		app.on ("error", (error) => {
			throw error;
		});
	} catch (error) {
		console.error ("ERR: ", error);
	}
})();
*/