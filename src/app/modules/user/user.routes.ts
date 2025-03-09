import { Router } from "express";

import clientInfoParser from "../../middlewears/clientInfoParser";
import ValidateRequest from "../../middlewears/ValidateRequest";
import { UserController } from "./user.controllers";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/",
  clientInfoParser,
  ValidateRequest(UserValidation.userValidationSchema),
  UserController.registerUser
);

export const UserRoutes = router;
