import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import config from "../../config";
import { IUser, UserModel, UserRole } from "./user.interface";

import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

// Create the User schema based on the interface
const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [UserRole.STUDENT, UserRole.TUTOR],
      default: UserRole.STUDENT,
    },

    clientInfo: {
      device: {
        type: String,
        enum: ["pc", "mobile"],
        // required: true,
      },
      browser: {
        type: String,
        //   required: true,
      },
      ipAddress: {
        type: String,
        //   required: true,
      },
      pcName: {
        type: String,
      },
      os: {
        type: String,
      },
      userAgent: {
        type: String,
      },
    },
    availability: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.checkUserExist = async function (userId: string) {
  const existingUser = await this.findById(userId);

  if (!existingUser) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User does not exist!");
  }

  if (!existingUser.availability) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "User is not active!");
  }

  return existingUser;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
