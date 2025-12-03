import { z } from "zod";

const createReviewValidation = z.object({
  body: z.object({
    revieweeId: z.string({ error: "Reviewee ID is required" }),
    travelPlanId: z.string({ error: "Travel Plan ID is required" }),
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    content: z.string().optional(),
  }),
});

const updateReviewValidation = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    content: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidation,
  updateReviewValidation,
};
