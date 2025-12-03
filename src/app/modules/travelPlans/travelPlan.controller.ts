import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { TravelPlanService } from "./travelPlan.services";
import pick from "../../helper/pick";
import { travelPlanFilterableFields } from "./travelPlan.constant";
import { fileUploader } from "../../helper/fileUploader";
import { Request, Response } from "express";
import ApiError from "../../middlewares/ApiError";


const createTravelPlan = catchAsync(async (req: Request & { user?: any }, res: Response) => {

  if (!req.user?.id) {
    throw new ApiError(401, "Authentication required");
  }

  const result = await TravelPlanService.createTravelPlan(
    req.body,
    req.user.id,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Travel plan created successfully",
    data: result,
  });
});

const getAllTravelPlans = catchAsync(async (req, res) => {
  const filters = pick(req.query, travelPlanFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await TravelPlanService.getAllTravelPlans(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel plans retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTravelPlan = catchAsync(async (req, res) => {
  const result = await TravelPlanService.getSingleTravelPlan(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel plan retrieved",
    data: result,
  });
});

const updateTravelPlan = catchAsync(async (req: any, res) => {
  let imageUrl = undefined;

  if (req.file) {
    const cloudResult = await fileUploader.uploadToCloudinary(req.file);
    imageUrl = cloudResult.secure_url;
  }

  const data = {
    ...req.body,
    ...(imageUrl && { image: imageUrl })
  };

  const result = await TravelPlanService.updateTravelPlan(
    req.params.id,
    req.user.id,
    data
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel plan updated successfully",
    data: result,
  });
});


const deleteTravelPlan = catchAsync(async (req: any, res) => {
  const result = await TravelPlanService.deleteTravelPlan(
    req.params.id,
    req.user.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel plan deleted",
    data: result,
  });
});

export const TravelPlanController = {
  createTravelPlan,
  getAllTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
};
