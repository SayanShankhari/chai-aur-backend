import { Router } from "express";


const testRouter = Router ();

// http://localhost:{${port}}/api/v1/users/test
testRouter.post ("/test", async (_request, response) => {
	try {
		response.status (200) .json (
			{
				success: true
				, message: "ok!"
				, data: "chai-aur-backend"
			}
		);
	} catch (error) {
		response.status (400) .json (
			{
				success: false
				, message: error.message
				, data: null
			}
		);
	}
});


export { testRouter };