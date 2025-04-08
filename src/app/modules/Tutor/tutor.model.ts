import { Schema, model, Document, Types } from "mongoose";
import { ITutor } from "./tutor.interface"; // Ensure the ITutor interface is imported correctly

const tutorSchema = new Schema<ITutor>(
  {
    user: {
      type: Schema.Types.ObjectId, // This should be a reference to the User model
      required: [true, "User id is required"],
      ref: "User",
      unique: true,
    },
    // name: {
    //   type: String,
    //   required: [true, "Name is required"], // Added as per the interface
    //   trim: true,
    // },
    // password: {
    //   type: String,
    //   required: [true, "Password is required"], // Added as per the interface
    // },
    // email: {
    //   type: String,
    //   required: [true, "Email is required"],
    //   unique: true, // Ensure unique email
    //   lowercase: true,
    //   trim: true,
    // },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    rate: {
      type: String,
      required: [true, "Rate is required"],
      trim: true,
    },
   

    about: {
      type: String,
      required: [true, "About is required"],
      trim: true,
    },
    subject: { type: String, required: [true, "Subject is required"] },
    aboutLesson: {
      type: String,
      required: [true, "About lesson is required"],
      trim: true,
    },
    intro: {
      type: String,
      required: [true, "Introduction is required"],
      trim: true,
    },
    imageUrls: {
      type: [String],
      required: [true, "Image URLs are required"],
    },
    firstLessonFree: {
      type: Boolean,
    },
    responseTime: {
      type: String,
     
      trim: true,
    },
    numberOfStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    badge: {
      type: String,
      default: null,
    },
 
    reviews: {
      type: [String],
      default: [],
    },
    // clientInfo: {
    //   device: {
    //     type: String,
    //     required: [true, "Device is required"],
    //     enum: ["pc", "mobile"], // Enum to restrict values to 'pc' or 'mobile'
    //   },
    //   browser: {
    //     type: String,
    //     required: [true, "Browser is required"],
    //   },
    //   ipAddress: {
    //     type: String,
    //     required: [true, "IP address is required"],
    //   },
    //   pcName: {
    //     type: String,
    //     default: null,
    //   },
    //   os: {
    //     type: String,
    //     default: null,
    //   },
    //   userAgent: {
    //     type: String,
    //     default: null,
    //   },
    // },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export const Tutor = model<ITutor>("Tutor", tutorSchema);
