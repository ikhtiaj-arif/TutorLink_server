import { Schema, model, Document, Types } from 'mongoose';
import { ITutor } from './tutor.interface'; // Make sure the ITutor interface is defined correctly

const tutorSchema = new Schema<ITutor>(
  {
    name: {
      type: String,
      required: [true, 'Tutor name is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Tutor location is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    rate: {
      type: String,
      required: [true, 'Rate is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: [String],
      default: [],
    },
    imgUrl: {
      type: [String],
      required: [true, 'Image URL is required'],
    },
    badge: {
      type: String,
      default: null,
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      trim: true,
    },
    responseTime: {
      type: String,
      required: [true, 'Response time is required'],
      trim: true,
    },
    numberOfStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    about: {
      type: String,
      required: [true, 'About is required'],
      trim: true,
    },
    aboutLesson: {
      type: String,
      required: [true, 'About lesson is required'],
      trim: true,
    },
    intro: {
      type: String,
      required: [true, 'Introduction is required'],
      trim: true,
    },
    firstLessonFree: {
      type: Boolean,
      required: [true, 'First lesson free status is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-generate the slug or ensure any other required field
// tutorSchema.pre<ITutor>('validate', function (next) {
//   if (this.isModified('name') && !this.slug) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/ /g, '-')
//       .replace(/[^\w-]+/g, '');
//   }
//   next();
// });

// // Example method to calculate the rating or offer details (you can add custom logic here)
// tutorSchema.methods.calculateDiscountedRate = async function () {
//   // You can add logic to calculate a discounted rate based on specific conditions
//   // For now, returning the same rate
//   return this.rate;
// };

export const Tutor = model<ITutor>('Tutor', tutorSchema);
