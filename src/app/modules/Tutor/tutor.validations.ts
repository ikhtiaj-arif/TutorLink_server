import { z } from 'zod';

const createTutorValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Tutor name is required",
    }).min(1, "Tutor name cannot be empty"),
    location: z.string({
      required_error: "Location is required",
    }).min(1, "Location cannot be empty"),
    subject: z.string({
      required_error: "Subject is required",
    }).min(1, "Subject cannot be empty"),
    rate: z.string({
      required_error: "Rate is required",
    }).min(1, "Rate cannot be empty"),
    rating: z.number({
      required_error: "Rating is required",
    }).min(0, "Rating cannot be less than 0").max(5, "Rating cannot be more than 5"),
    reviews: z.array(z.string()).min(0, "Reviews must be an array").optional(),
    imgUrl: z.string({
      required_error: "Image URL is required",
    }).url("Image URL must be a valid URL"),
    badge: z.string().optional(),
    availability: z.string({
      required_error: "Availability is required",
    }).min(1, "Availability cannot be empty"),
    responseTime: z.string({
      required_error: "Response time is required",
    }).min(1, "Response time cannot be empty"),
    numberOfStudents: z.number({
      required_error: "Number of students is required",
    }).min(0, "Number of students cannot be less than 0"),
    about: z.string({
      required_error: "About is required",
    }).min(1, "About cannot be empty"),
    aboutLesson: z.string({
      required_error: "About lesson is required",
    }).min(1, "About lesson cannot be empty"),
    intro: z.string({
      required_error: "Introduction is required",
    }).min(1, "Introduction cannot be empty"),
    firstLessonFree: z.boolean({
      required_error: "First lesson free status is required",
    }),
  })
});

const updateTutorValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Tutor name cannot be empty").optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    subject: z.string().min(1, "Subject cannot be empty").optional(),
    rate: z.string().min(1, "Rate cannot be empty").optional(),
    rating: z.number().min(0, "Rating cannot be less than 0").max(5, "Rating cannot be more than 5").optional(),
    reviews: z.array(z.string()).optional(),
    imgUrl: z.string().url("Image URL must be a valid URL").optional(),
    badge: z.string().optional(),
    availability: z.string().min(1, "Availability cannot be empty").optional(),
    responseTime: z.string().min(1, "Response time cannot be empty").optional(),
    numberOfStudents: z.number().min(0, "Number of students cannot be less than 0").optional(),
    about: z.string().min(1, "About cannot be empty").optional(),
    aboutLesson: z.string().min(1, "About lesson cannot be empty").optional(),
    intro: z.string().min(1, "Introduction cannot be empty").optional(),
    firstLessonFree: z.boolean().optional(),
  })
});

export const tutorValidation = {
  createTutorValidationSchema,
  updateTutorValidationSchema
}
