import express from "express";
import { TravelPlanController } from "./travelPlan.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TravelPlanValidation } from "./travelPlan.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

// CREATE
router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  validateRequest(TravelPlanValidation.create),
  TravelPlanController.createTravelPlan
);

// GET ALL
router.get("/", TravelPlanController.getAllTravelPlans);

// GET SINGLE
router.get("/:id", TravelPlanController.getSingleTravelPlan);

// UPDATE
router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  validateRequest(TravelPlanValidation.update),
  TravelPlanController.updateTravelPlan
);

// DELETE
router.delete(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlanController.deleteTravelPlan
);

export const TravelPlanRoutes = router;
