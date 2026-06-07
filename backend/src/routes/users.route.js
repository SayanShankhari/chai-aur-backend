import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";


const usersRouter = Router ();

// usersRouter.route ("/register") .post (userController.registerUser);
usersRouter.post ("/register", multerMiddleware.uploadFilesFrom.fields (
	[
		{ name: "avatar", maxCount: 1 }
		, { name: "banner", maxCount: 1 }
	]
), userController.registerUser);
usersRouter.route ("/list") .get (userController.getAllUsers);
usersRouter.route ("/get:id") .get (userController.getUserById);
usersRouter.route ("/update:id") .put (userController.updateUser);
usersRouter.route ("/delete:id") .delete (userController.deleteUser);
// without using route chaining
// secured routes:
usersRouter.post ("/login", authMiddleware.verifyToken, userController.loginUser);
usersRouter.post ("/logout", authMiddleware.verifyToken, userController.logoutUser);
// again using route chaining
usersRouter.route ("/refresh-token").post (userController.refreshAccessToken);

export { usersRouter };