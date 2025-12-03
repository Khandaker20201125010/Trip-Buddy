import { Request } from "express";

export interface ITravelPlan {
  id?: string;
  userId?: string;
  destination: string;
  image?: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelType: string;
  description?: string;
  visibility?: boolean;
}
