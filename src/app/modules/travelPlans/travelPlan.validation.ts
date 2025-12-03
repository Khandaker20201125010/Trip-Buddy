import { z } from "zod";

export const createTravelPlanValidation = z.object({
  body: z.object({
    destination: z.string().min(1, "Destination is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.number().positive("Budget must be positive"),
    travelType: z.string().min(1, "Travel type is required"),
    description: z.string().optional(),
    visibility: z.boolean().optional(),
  }),
});

export const updateTravelPlanValidation = z.object({
  body: z.object({
    destination: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    budget: z.number().optional(),
    travelType: z.string().optional(),
    description: z.string().optional(),
    visibility: z.boolean().optional(),
  }),
});
