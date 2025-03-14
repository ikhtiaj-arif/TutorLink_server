import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QureyBuilder";
import AppError from "../../errors/AppError";
import { IImageFiles } from "../../interface/IImageFIle";
import { IJwtPayload } from "../Auth/auth.interface";
import User from "../user/user.model";
import { ITutor } from "./tutor.interface";
import { Tutor } from "./tutor.model";
import mongoose from "mongoose";

const createTutor = async (
  tutorData: Partial<ITutor>,
  tutorImage: IImageFiles,
  AuthServices: any // Assuming you want to return a token, you might need AuthServices
) => {
  const { image } = tutorImage;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the image is provided
    if (!image) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Tutor image is required.");
    }

    // Check if the tutor already exists by email or any other unique identifier
    const existingTutor = await Tutor.findOne({ email: tutorData.email }).session(session);
    if (existingTutor) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
    }

    // Create the tutor
    const newTutor = new Tutor({
      ...tutorData,
      image: image // Assuming you want to store the image in the tutor document
    });

    const createdTutor = await newTutor.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Assuming AuthServices.loginTutor exists or you want to return a token
    return await AuthServices.loginTutor({ email: createdTutor.email, password: tutorData.password, clientInfo: tutorData.clientInfo });

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
    Tutor.find(filter).populate("shop", "shopName").populate("reviews"),
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
  const tutor = await Tutor.findById(tutorId)
    .populate("shop")
    .populate("reviews");

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

  if (!user?.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not active");
  }

  if (!tutor) {
    throw new AppError(StatusCodes.NOT_FOUND, "Tutor Not Found");
  }

  return await Tutor.findByIdAndDelete(tutorId);
};

export const TutorService = {
  createTutor,
  getAllTutors,

  getSingleTutor,

  deleteTutor,
};
