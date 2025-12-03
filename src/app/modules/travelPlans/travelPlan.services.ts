import { prisma } from "../../shared/prisma";
import ApiError from "../../middlewares/ApiError";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { paginationHelper, IOptions } from "../../helper/paginationHelper";
import { travelPlanSearchableFields } from "./travelPlan.constant";
import { fileUploader } from "../../helper/fileUploader";

const createTravelPlan = async (payload: any, userId: string, file?: Express.Multer.File) => {
  let imageUrl = null;

  if (file) {
    const cloudResult = await fileUploader.uploadToCloudinary(file);
    imageUrl = cloudResult.secure_url;
  }

  return await prisma.travelPlan.create({
    data: {
      ...payload,
      image: imageUrl,
      budget: Number(payload.budget),
      userId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
    },
  });
};


const getAllTravelPlans = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, minBudget, maxBudget, startDate, endDate, ...filterData } =
    params;

  const andConditions: Prisma.TravelPlanWhereInput[] = [];

  // search (destination / travelType)
  if (searchTerm) {
    andConditions.push({
      OR: travelPlanSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // budget filter
  if (minBudget || maxBudget) {
    andConditions.push({
      budget: {
        gte: minBudget ? Number(minBudget) : undefined,
        lte: maxBudget ? Number(maxBudget) : undefined,
      },
    });
  }

  // date filter
  if (startDate || endDate) {
    andConditions.push({
      startDate: {
        gte: startDate ? new Date(startDate) : undefined,
      },
      endDate: {
        lte: endDate ? new Date(endDate) : undefined,
      },
    });
  }

  // direct filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: filterData[key],
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.travelPlan.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: { [sortBy]: sortOrder },
    include: { user: true },
  });

  const total = await prisma.travelPlan.count({ where: whereConditions });

  return { meta: { page, limit, total }, data: result };
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
  if (existing.userId !== userId)
    throw new ApiError(403, "Unauthorized to update");

  // Convert values if provided
  const updatedData: any = {
    ...payload,
  };

  if (payload.budget) updatedData.budget = Number(payload.budget);
  if (payload.startDate) updatedData.startDate = new Date(payload.startDate);
  if (payload.endDate) updatedData.endDate = new Date(payload.endDate);

  return prisma.travelPlan.update({
    where: { id },
    data: updatedData,
  });
};

const deleteTravelPlan = async (id: string, userId: string) => {
  const existing = await prisma.travelPlan.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Not found");
  if (existing.userId !== userId)
    throw new ApiError(403, "Unauthorized to delete");

  await prisma.travelPlan.delete({ where: { id } });

  return { message: "Travel Plan deleted successfully" };
};


const matchTravelPlans = async (filters: any) => {
  const { destination, startDate, endDate, travelType } = filters;

  return prisma.travelPlan.findMany({
    where: {
      AND: [
        destination ? { destination: { contains: destination, mode: "insensitive" } } : {},
        travelType ? { travelType } : {},
        startDate ? { startDate: { gte: new Date(startDate) } } : {},
        endDate ? { endDate: { lte: new Date(endDate) } } : {},
      ],
    },
    include: { user: true },
  });
};

export const TravelPlanService = {
  createTravelPlan,
  getAllTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelPlans,
};
