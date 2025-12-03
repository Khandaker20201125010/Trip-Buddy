export interface ITravelPlan {
  id?: string;
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelType: string;
  description?: string;
  visibility?: boolean;
}
