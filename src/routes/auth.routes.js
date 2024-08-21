import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { COOKIES_SECURE, COOKIES_SAMESITE } from "../config/env.js";

const router = Router();

// Signup a user with username and password
router.post("/signup", AuthController.signup);
// Signin a user with username and password
router.post("/signin", AuthController.signin);
// Check if user is authenticated with JWT Token
router.get("/is-authenticated", AuthController.isAuthenticated);
// Logout an user
router.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: COOKIES_SECURE === "true",
        sameSite: COOKIES_SAMESITE,
    })
        .status(200)
        .json({ message: "Sesión cerrada!", data: null });
});

export default router;
