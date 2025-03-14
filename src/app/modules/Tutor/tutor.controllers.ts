import { Request, Response } from "express";

import { TutorService } from "./tutor.service"; // Assuming you have a tutor service

import { StatusCodes } from "http-status-codes";
import { IImageFiles } from "../../interface/IImageFIle";
import catchAsync from "../../utils/CatchAsync";
import sendResponse from "../../utils/SendResponse";

const createTutor = catchAsync(async (req: Request, res: Response) => {
  const result = await TutorService.createTutor(
    req.body,
    req.files as IImageFiles // If you're uploading tutor profile images
  );
  console.log(req.body, req.files, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tutor created successfully",
    data: result,
  });
});

// const getAllTutors = catchAsync(async (req, res) => {
//   const result = await TutorService.getAllTutors(req.query);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Tutors are retrieved successfully",
//     meta: result.meta,
//     data: result.result,
//   });
// });

// const getTrendingTutors = catchAsync(async (req, res) => {
//   const { limit } = req.query;
//   const result = await TutorService.getTrendingTutors(Number(limit));

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Trending tutors are retrieved successfully",
//     data: result,
//   });
// });

// const getSingleTutor = catchAsync(async (req, res) => {
//   const { tutorId } = req.params;
//   const result = await TutorService.getSingleTutor(tutorId);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Tutor retrieved successfully",
//     data: result,
//   });
// });

// const getMyTutors = catchAsync(async (req, res) => {
//   const result = await TutorService.getMyTutors(req.query, req.user as IJwtPayload);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Your tutors are retrieved successfully",
//     meta: result.meta,
//     data: result.result,
//   });
// });

// const updateTutor = catchAsync(async (req, res) => {
//   const {
//     user,
//     body: payload,
//     params: { tutorId },
//   } = req;

//   const result = await TutorService.updateTutor(
//     tutorId,
//     payload,
//     req.files as IImageFiles, // If you're uploading tutor profile images
//     user as IJwtPayload
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Tutor updated successfully",
//     data: result,
//   });
// });

// // hard delete
// const deleteTutor = catchAsync(async (req, res) => {
//   const {
//     user,
//     params: { tutorId },
//   } = req;

//   const result = await TutorService.deleteTutor(
//     tutorId,
//     user as IJwtPayload
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Tutor deleted successfully",
//     data: result,
//   });
// });

export const TutorController = {
  createTutor,
};
