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
usersRouter.route ("/list") .get (authMiddleware.verifyToken, userController.getAllUsers);
usersRouter.route ("/get:id") .get (authMiddleware.verifyToken, userController.getUserById);
usersRouter.route ("/update:id") .put (authMiddleware.verifyToken, userController.updateUser);
usersRouter.route ("/delete:id") .delete (authMiddleware.verifyToken, userController.deleteUser);
// without using route chaining
usersRouter.post ("/login", authMiddleware.verifyToken, userController.loginUser);

// secured routes:
usersRouter.post ("/logout", authMiddleware.verifyToken, userController.logoutUser);


export { usersRouter };