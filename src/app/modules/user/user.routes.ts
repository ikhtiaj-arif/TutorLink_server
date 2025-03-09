import { Router } from "express";

import { UserController } from "./user.controllers";
import clientInfoParser from "../../middlewears/clientInfoParser";
import ValidateRequest from "../../middlewears/ValidateRequest";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/",
    clientInfoParser,
    ValidateRequest(UserValidation.userValidationSchema),
  UserController.registerUser
);

export const UserRoutes = router;
