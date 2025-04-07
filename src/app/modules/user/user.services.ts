import mongoose from "mongoose";
import { INewUser, IUser, UserRole } from "./user.interface";
import User from "./user.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import Customer from "../customer/customer.model";
import { AuthServices } from "../Auth/auth.services";
import QueryBuilder from "../../builder/QureyBuilder";
import { UserSearchableFields } from "./user.constant";
import { IJwtPayload } from "../Auth/auth.interface";
import { ICustomer } from "../customer/customer.interface";
import { Tutor } from "../Tutor/tutor.model";
import { ITutor } from "../Tutor/tutor.interface";

const createStudentDB = async (studentData: IUser) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!studentData.role) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Invalid role.");
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({
      email: studentData.email,
    }).session(session);
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered"
      );
    }

    // Create the user
    const user = new User(studentData);
    const createdUser = await user.save({ session });

    await session.commitTransaction();

    return await AuthServices.loginUser({
      email: createdUser.email,
      password: studentData.password,
      clientInfo: studentData.clientInfo,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const createTutorDB = async (payload: ITutor) => {
  const userData: Partial<INewUser> = {};

  //if password not given use default password
  userData.password = payload.password;

  //set student role
  userData.role = "tutor";
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: payload.email }).session(
      session
    );
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered"
      );
    }

    // transaction-1 Create the user
    const newUser = await User.create([userData], { session });

    payload.user = newUser[0]._id as string; //reference id

    //transaction-2 Create the tutor
    const createTutor = await Tutor.create([payload], { session });

    await session.commitTransaction();

    return await AuthServices.loginUser({
      email: createTutor[0].email,
      password: createTutor[0].password,
      clientInfo: createTutor[0].clientInfo,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};
// Function to register user
const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    if (!userData.role) {
      throw new AppError(StatusCodes.NOT_ACCEPTABLE, "Invalid role.");
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(
      session
    );
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered"
      );
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    await session.commitTransaction();

    return await AuthServices.loginUser({
      email: createdUser.email,
      password: userData.password,
      clientInfo: userData.clientInfo,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllUser = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();
  return {
    result,
    meta,
  };
};

const myProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser.userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }
  if (!isUserExists.availability) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
  }

  const profile = await Customer.findOne({ user: isUserExists._id });

  return {
    ...isUserExists.toObject(),
    profile: profile || null,
  };
};

// const updateProfile = async (
//    payload: Partial<ICustomer>,
//    file: IImageFile,
//    authUser: IJwtPayload
// ) => {
//    const isUserExists = await User.findById(authUser.userId);

//    if (!isUserExists) {
//       throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
//    }
//    if (!isUserExists.isActive) {
//       throw new AppError(StatusCodes.BAD_REQUEST, "User is not active!");
//    }

//    if (file && file.path) {
//       payload.photo = file.path;
//    }

//    const result = await Customer.findOneAndUpdate(
//       { user: authUser.userId },
//       payload,
//       {
//          new: true,
//       }
//    ).populate('user');

//    return result;
// };

// const updateUserStatus = async (userId: string) => {
//    const user = await User.findById(userId);

//    console.log('comes here');
//    if (!user) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'User is not found');
//    }

//    user.isActive = !user.isActive;
//    const updatedUser = await user.save();
//    return updatedUser;
// };

export const UserServices = {
  registerUser,
  getAllUser,
  myProfile,
  createStudentDB,
  createTutorDB,
  //  updateUserStatus,
  //  updateProfile,
};
