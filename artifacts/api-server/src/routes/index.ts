import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reportsRouter from "./reports";
import recognitionsRouter from "./recognitions";
import aggregateRouter from "./aggregate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(reportsRouter);
router.use(recognitionsRouter);
router.use(aggregateRouter);

export default router;
