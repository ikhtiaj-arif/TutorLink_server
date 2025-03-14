import { Router } from "express";

import { multerUpload } from "../../config/multer.config";
import ValidateRequest from "../../middlewears/ValidateRequest";
import { TutorController } from "./tutor.controllers";
import { tutorValidation } from "./tutor.validations";
import { parseBody } from "../../middlewears/bodyParser";

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

// // Get a single tutor by their ID
// router.get('/:tutorId', TutorController.getSingleTutor);

// Create a new tutor profile
router.post(
  "/",
  // auth(UserRole.TUTOR),
  multerUpload.fields([{ name: "image" }]), // You can adjust this to the correct field name if needed
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
