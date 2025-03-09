import { Router } from "express";
import clientInfoParser from "../../middlewears/clientInfoParser";
import { AuthControllers } from "./auth.controllers";

const router = Router();
const { refreshToken, loginUser } = AuthControllers;

router.post("/login", clientInfoParser, loginUser);

router.post(
  "/refresh-token",
  // validateRequest(AuthValidation.refreshTokenZodSchema),
  refreshToken
);

// router.post(
//   "/change-password",
//   auth(UserRole.ADMIN, UserRole.USER),
//   changePassword
// );

// router.post("/forgot-password", forgotPassword);

export const AuthRoutes = router;
