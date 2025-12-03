import { prisma } from "../../shared/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { paginationHelper, IOptions } from "../../helper/paginationHelper";
import { travelPlanSearchableFields } from "./travelPlan.constant";

const createTravelPlan = async (payload: any, userId: string) => {
  const plan = await prisma.travelPlan.create({
    data: {
      ...payload,
      userId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  });

  return plan;
};

const getAllTravelPlans = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, minBudget, maxBudget, ...filterData } = params;

  const andConditions: Prisma.TravelPlanWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: travelPlanSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (minBudget || maxBudget) {
    andConditions.push({
      budget: {
        gte: minBudget ? Number(minBudget) : undefined,
        lte: maxBudget ? Number(maxBudget) : undefined,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: filterData[key],
      })),
    });
  }

  const whereConditions: Prisma.TravelPlanWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.travelPlan.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: true,
    },
  });

  const total = await prisma.travelPlan.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getSingleTravelPlan = async (id: string) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, "Travel Plan not found");

  return plan;
};

const updateTravelPlan = async (id: string, userId: string, payload: any) => {
  const existing = await prisma.travelPlan.findUnique({ where: { id } });

  if (!existing) throw new ApiError(404, "Travel Plan not found");

  if (existing.userId !== userId) {
    throw new ApiError(403, "Unauthorized to update this travel plan");
  }

  return prisma.travelPlan.update({
    where: { id },
    data: payload,
  });
};

const deleteTravelPlan = async (id: string, userId: string) => {
  const existing = await prisma.travelPlan.findUnique({ where: { id } });

  if (!existing) throw new ApiError(404, "Travel Plan not found");

  if (existing.userId !== userId) {
    throw new ApiError(403, "Unauthorized to delete this travel plan");
  }

  await prisma.travelPlan.delete({ where: { id } });

  return { message: "Travel Plan deleted successfully" };
};

export const TravelPlanService = {
  createTravelPlan,
  getAllTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
};
