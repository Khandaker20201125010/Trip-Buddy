import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { TravelPlanRoutes } from '../modules/travelPlans/travelPlan.routes';
import { ReviewRoutes } from '../modules/reviews/review.routes';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/travelPlan',
        route: TravelPlanRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;