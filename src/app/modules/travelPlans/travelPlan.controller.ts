import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { TravelPlanService } from "./travelPlan.services";
import pick from "../../helper/pick";
import { travelPlanFilterableFields } from "./travelPlan.constant";

const createTravelPlan = catchAsync(async (req: any, res) => {
  const result = await TravelPlanService.createTravelPlan(req.body, req.user.id);

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
  const result = await TravelPlanService.updateTravelPlan(
    req.params.id,
    req.user.id,
    req.body
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
