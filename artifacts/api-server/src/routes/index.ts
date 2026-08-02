import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moderateRouter from "./moderate";
import assignmentsRouter from "./assignments";
import whopRouter from "./whop";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moderateRouter);
router.use(assignmentsRouter);
router.use(whopRouter);

export default router;
