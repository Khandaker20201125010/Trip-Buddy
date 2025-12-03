import { z } from "zod";

export const TravelPlanValidation = {
  create: z.object({
    body: z.object({
      destination: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      budget: z.number(),
      travelType: z.string(),
      description: z.string().optional(),
      visibility: z.boolean().optional(),
    }),
  }),

  update: z.object({
    body: z.object({
      destination: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().optional(),
      travelType: z.string().optional(),
      description: z.string().optional(),
      visibility: z.boolean().optional(),
    }),
  }),
};
