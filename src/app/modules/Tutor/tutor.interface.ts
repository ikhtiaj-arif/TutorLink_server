import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface ITutor {
  user: Types.ObjectId;
  // name:string;
  // email: string;
  // password: string;
  location: string;
  rate: string;
  subject: string;
  about: string;
  aboutLesson: string;
  intro: string;
  imageUrls: string[];
  responseTime?: string;
  badge?: string;
  numberOfStudents?: number;
  reviews?: string[];
  firstLessonFree?: boolean;
  // clientInfo: {
  //   device: "pc" | "mobile"; // Device type
  //   browser: string; // Browser name
  //   ipAddress: string; // User IP address
  //   pcName?: string; // Optional PC name
  //   os?: string; // Optional OS name (Windows, MacOS, etc.)
  //   userAgent?: string; // Optional user agent string
  // };
}
// types/tutor.ts
export type ITutorWithUserData = ITutor & IUser;