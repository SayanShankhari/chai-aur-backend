import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FILE_SIZE_LIMIT } from "./constants.mjs";

const app = express ();

app.use (express.json (
	{
		limit: FILE_SIZE_LIMIT
	}
));
app.use (express.urlencoded (
	{
		extended: true	// nested objects and arrays can be encoded into the URL-encoded format, allowing for rich data structures to be sent in the request body
		, limit: FILE_SIZE_LIMIT
	}
));
app.use (express.static ("public"));	// to serve static files from public folder, like images, css, js files etc
app.use (cors (
	{
		origin: process.env.CORS_ORIGIN.split (",")
		, credentials: true
	}
));
app.use (cookieParser ());

export default app;