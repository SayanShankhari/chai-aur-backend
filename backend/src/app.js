import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FILE_SIZE_LIMIT } from "./constants.mjs";
import { responseMiddleware } from "./middlewares/response.middleware.js";


const app = express ();

app.use (express.json (
	{
		limit: FILE_SIZE_LIMIT
	}
));
// 1. register Success Helper at the top
app.use (responseMiddleware.successMiddleware);
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


// import routes
import { testRouter } from "./routes/test.route.js";
import { usersRouter } from "./routes/users.route.js";
import { userRouter } from "./routes/user.route.js";

app.get ("/", (_request, response) => {
	response.send ("hello!");
});
app.get ("/test", (_request, response) => {
	response.json (
		{
			status: 200
			, message: "chai-aur-backend!"
		}
	);
});
// 2. register application routes
// app.use ("/user", userRouter);
app.use ("/api/test", testRouter);
app.use ("/api/v1/users", usersRouter);
app.use ("/api/v1/user", userRouter);
// to avoid conflict with frontend routes, we can prefix all backend routes with /api/v1 or something like that
// control flow: ROUTER -> CONTROLLER -> SERVICE -> MODEL -> DATABASE => SERVICE => CONTROLLER => ROUTER => RESPONSE
// localhost:5000/api/v1/users/[register/login/getAll/getById/update/delete]
// localhost:5000/api/v1/user/[profile/update/logout]

// 3. MUST BE LAST: register the global Error Handler at the absolute bottom
app.use (responseMiddleware.failureMiddleware);


export default app;