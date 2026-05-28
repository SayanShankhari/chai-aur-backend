import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router ();

// Route to generate a new access token (uses REFRESH_TOKEN_SECRET internally)
userRouter.post ('/auth/refresh', authController.refreshToken);

// Normal route (uses ACCESS_TOKEN_SECRET via middleware)
userRouter.route ("/profile") .get (authMiddleware.verifyToken, userController.getMyProfile);
userRouter.route ("/update") .put (authMiddleware.verifyToken, userController.updateUser);
// userRouter.route ("/logout") .delete (authMiddleware.verifyToken, userController.logoutUser);

export { userRouter };