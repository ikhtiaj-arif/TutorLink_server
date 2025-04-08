import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QureyBuilder";
import AppError from "../../errors/AppError";
import { IImageFiles } from "../../interface/IImageFIle";
import { IJwtPayload } from "../Auth/auth.interface";
import { AuthServices } from "../Auth/auth.services";
import { UserRole } from "../user/user.interface";
import User from "../user/user.model";
import { ITutor, ITutorWithUserData } from "./tutor.interface";
import { Tutor } from "./tutor.model";

const createTutorReg = async (
  tutorData: Partial<ITutorWithUserData>, // Tutor data from the registration form
  tutorImage: IImageFiles // Image files for the tutor
) => {

  const { images } = tutorImage;
  const session = await mongoose.startSession();

  // Map the image paths to imageUrls in the tutorData
  tutorData.imageUrls = images.map((image) => image.path);

  try {
    session.startTransaction();

    // Check if the image is provided
    if (!images || images.length === 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tutor image is required.");
    }

    // Check if the email already exists as a tutor
    const existingTutor = await User.findOne({
      email: tutorData.email,
    }).session(session);
    if (existingTutor) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered."
      );
    }

    // Create the new user from tutorData (email, password, name)
    const newUser = new User({
      email: tutorData.email,
      password: tutorData.password, // Assuming password is provided in tutorData
      name: tutorData.name, // Assuming name is passed in tutorData
      role: UserRole.TUTOR, // Set role to 'tutor'
    });

    // Save the user (will throw an error if email is already registered)
    const createdUser = await newUser.save({ session });

    const { email, password, name, ...tutorDataWithoutCredentials } = tutorData;

    // Create the tutor profile
    const newTutor = new Tutor({
      ...tutorDataWithoutCredentials,
      user: createdUser._id, // Assign the new user's _id to the user field in Tutor model
    });

    // Save the tutor profile
    const createdTutor = await newTutor.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Assuming AuthServices.loginTutor exists to return a token for the newly created user
    return await AuthServices.loginUser({
      email: createdUser.email,
      password: tutorData.password as string,
      clientInfo: tutorData.clientInfo!, // Assuming clientInfo is part of the tutorData
    });

    // Return the created tutor and the generated token
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};
const createTutor = async (
  tutorData: Partial<ITutor>,
  tutorImage: IImageFiles,
  authUser: IJwtPayload
) => {
  const { images } = tutorImage;
  const session = await mongoose.startSession();

  tutorData.imageUrls = images.map((image) => image.path);

  try {
    session.startTransaction();

    // Check if the image is provided
    if (!images) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tutor image is required.");
    }
    console.log(tutorData);

    // Check if the tutor already exists by email or any other unique identifier
    const existingTutor = await Tutor.findOne({
      email: authUser.email,
    }).session(session);
    if (existingTutor) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered"
      );
    }

    // Create the tutor
    const newTutor = new Tutor(tutorData);

    const createdTutor = await newTutor.save({ session });

    // update user role
    const updateUser = await User.findOne({ email: authUser.email }).session(
      session
    );
    if (!updateUser) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
    }

    // Update the user's role to 'tutor'
    updateUser.role = UserRole.TUTOR; // Assuming the role field is named 'role'
    await updateUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    return createdTutor;

    // Assuming AuthServices.loginTutor exists or you want to return a token
    // return await AuthServices.loginTutor({ email: createdTutor.email, password: tutorData.password, clientInfo: tutorData.clientInfo });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllTutors = async (query: Record<string, unknown>) => {
  const { ratings, subjects, availability, minPrice, maxPrice, ...pQuery } =
    query;

  // Build the filter object
  const filter: Record<string, any> = {};

  // Filter by subjects
  if (subjects) {
    const subjectArray =
      typeof subjects === "string"
        ? subjects.split(",")
        : Array.isArray(subjects)
        ? subjects
        : [subjects];
    filter.subject = { $in: subjectArray };
  }

  // Filter by availability
  if (availability) {
    filter.availability = availability;
  }

  // Filter by ratings
  if (ratings) {
    const ratingArray =
      typeof ratings === "string"
        ? ratings.split(",")
        : Array.isArray(ratings)
        ? ratings
        : [ratings];
    filter.rating = { $in: ratingArray.map(Number) };
  }

  const tutorQuery = new QueryBuilder(
    // Tutor.find(filter).populate("shop", "shopName").populate("reviews"),
    Tutor.find(filter).populate("user"),
    pQuery
  )
    .search(["name", "subject", "about"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const tutors = await tutorQuery.modelQuery.lean();
  const meta = await tutorQuery.countTotal();

  return { meta, result: tutors };
};

// const getTrendingTutors = async (limit: number) => {
//    // You can implement a logic similar to getTrendingProducts
//    const trendingTutors = await Review.aggregate([
//       {
//          $group: {
//             _id: '$tutor',
//             reviewCount: { $sum: 1 },
//          },
//       },
//       {
//          $sort: { reviewCount: -1 },
//       },
//       {
//          $limit: limit || 10,
//       },
//       {
//          $lookup: {
//             from: 'tutors',
//             localField: '_id',
//             foreignField: '_id',
//             as: 'tutorDetails',
//          },
//       },
//       {
//          $unwind: '$tutorDetails',
//       },
//       {
//          $project: {
//             _id: 0,
//             tutorId: '$_id',
//             reviewCount: 1,
//             name: '$tutorDetails.name',
//             subject: '$tutorDetails.subject',
//             rate: '$tutorDetails.rate',
//             imgUrl: '$tutorDetails.imgUrl',
//          },
//       },
//    ]);

//    return trendingTutors;
// };

const getSingleTutor = async (tutorId: string) => {
  const tutor = await Tutor.findById(tutorId).populate("user");

  if (!tutor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found");
  }

  //    const reviews = await Review.find({ tutor: tutor._id });

  const tutorObj = tutor.toObject();

  return {
    ...tutorObj,
    //   reviews
  };
};
const getProfileData = async (authUser: IJwtPayload) => {
  const tutor = await Tutor.findOne({ user: authUser?.userId }).populate(
    "user"
  );

  if (!tutor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found");
  }

  //    const reviews = await Review.find({ tutor: tutor._id });

  const tutorObj = tutor.toObject();

  return {
    ...tutorObj,
    //   reviews
  };
};

// const getMyTutors = async (query: Record<string, unknown>, authUser: IJwtPayload) => {
//    const userHasShop = await User.findById(authUser.userId).select('isActive');

//    if (!userHasShop) throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
//    if (!userHasShop.isActive) throw new AppError(StatusCodes.BAD_REQUEST, "User account is not active!");
//    if (!userHasShop.hasShop) throw new AppError(StatusCodes.BAD_REQUEST, "User does not have any shop!");

//    const shopIsActive = await Shop.findOne({
//       user: userHasShop._id,
//       isActive: true
//    }).select("isActive");

//    if (!shopIsActive) throw new AppError(StatusCodes.BAD_REQUEST, "Shop is not active!");

//    const { minPrice, maxPrice, ...pQuery } = query;

//    const tutorQuery = new QueryBuilder(
//       Tutor.find({ shop: shopIsActive._id })
//          .populate('shop', 'shopName'),
//       pQuery
//    )
//       .search(['name', 'subject', 'about'])
//       .filter()
//       .sort()
//       .paginate()
//       .fields()
//       .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

//    const tutors = await tutorQuery.modelQuery.lean();

//    const meta = await tutorQuery.countTotal();

//    return {
//       meta,
//       result: tutors,
//    };
// };

const deleteTutor = async (tutorId: string, authUser: IJwtPayload) => {
  const user = await User.findById(authUser.userId);

  const tutor = await Tutor.findOne({
    _id: tutorId,
  });

  if (!tutor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tutor Not Found");
  }

  return await Tutor.findByIdAndDelete(tutorId);
};

export const TutorService = {
  createTutor,
  getAllTutors,
  createTutorReg,
 
  getSingleTutor,
  getProfileData,
  deleteTutor,
};
