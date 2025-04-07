import { z } from "zod";

const createTutorValidationSchema = z.object({
  body: z.object({
    data: z.object({
      user: z.string(), // User ID is required
      name: z.string().min(1, "Name is required"), // Name is required
      email: z.string().email("Invalid email format"), // Email is required and should be valid
      password: z.string().min(1, "Password is required"), // Password is required
      location: z.string().min(1, "Location cannot be empty"), // Location is required
      rate: z.string().min(1, "Rate cannot be empty"), // Rate is required
      subject: z.string().min(1, "Subject is required"), // Subject is required
      about: z.string().min(1, "About is required"), // About is required
      intro: z.string().min(1, "Introduction is required"), // Introduction is required
      aboutLesson: z.string().min(1, "About lesson is required"), // About lesson is required
      responseTime: z
        .string()
        .min(1, "Response time cannot be empty")
        .optional(), // Response time is optional
      badge: z.string().optional(), // Badge is optional
      numberOfStudents: z
        .number()
        .min(0, "Number of students cannot be less than 0")
        .optional(), // Number of students is optional
      reviews: z.array(z.string()).optional(), // Reviews is an optional array
      firstLessonFree: z.boolean().optional(), // First lesson free is optional
    }),
    imgUrl: z
      .array(z.string().url("Each image URL must be a valid URL"))
      .optional(),
  }),
});

const updateTutorValidationSchema = z.object({
  body: z.object({
    user: z.string().uuid("User ID must be a valid UUID").optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    rate: z.string().min(1, "Rate cannot be empty").optional(),
    reviews: z.array(z.string()).optional(),
    imgUrl: z
      .array(z.string().url("Each image URL must be a valid URL"))
      .optional(),
    badge: z.string().optional(),
    responseTime: z.string().min(1, "Response time cannot be empty").optional(),
    numberOfStudents: z
      .number()
      .min(0, "Number of students cannot be less than 0")
      .optional(),
    about: z.string().min(1, "About cannot be empty").optional(),
    aboutLesson: z.string().min(1, "About lesson cannot be empty").optional(),
    intro: z.string().min(1, "Introduction cannot be empty").optional(),
    firstLessonFree: z.boolean().optional(),
  }),
});

export const tutorValidation = {
  createTutorValidationSchema,
  updateTutorValidationSchema,
};
