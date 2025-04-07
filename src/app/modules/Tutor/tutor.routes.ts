import { Router } from "express";

import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewears/auth";
import { parseBody } from "../../middlewears/bodyParser";
import ValidateRequest from "../../middlewears/ValidateRequest";
import { UserRole } from "../user/user.interface";
import { TutorController } from "./tutor.controllers";
import { tutorValidation } from "./tutor.validations";

const router = Router();

// // Get all tutors
// router.get('/', TutorController.getAllTutors);

// // Get trending tutors
// router.get('/trending', TutorController.getTrendingTutors);

// // Get tutors for the logged-in user's shop (if applicable)
// router.get(
//    '/my-tutors',
//    auth(UserRole.USER),
//    TutorController.getMyTutors
// );

router.get("/my-profile", auth(UserRole.TUTOR), TutorController.getProfileData);
// // Get a single tutor by their ID
router.get("/:tutorId", TutorController.getSingleTutor);

// Create a new tutor profile
router.post(
  "/register",
  multerUpload.fields([{ name: "images" }]), // You can adjust this to the correct field name if needed
  parseBody,
  // ValidateRequest(tutorValidation.createTutorValidationSchema),
  TutorController.createTutorReg
);
router.post(
  "/",
  auth(UserRole.STUDENT),
  multerUpload.fields([{ name: "images" }]), // You can adjust this to the correct field name if needed
  parseBody,
  ValidateRequest(tutorValidation.createTutorValidationSchema),
  TutorController.createTutor
);

// // Update an existing tutor profile
// router.patch(
//    '/:tutorId',
//    auth(UserRole.USER),
//    multerUpload.fields([{ name: 'profileImage' }]), // Adjust this based on your needs
//    parseBody,
//    TutorController.updateTutor
// );

// // Delete a tutor profile
// router.delete(
//    '/:tutorId',
//    auth(UserRole.USER),
//    TutorController.deleteTutor
// );

export const TutorRoutes = router;
