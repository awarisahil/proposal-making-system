import { Router } from "express";

import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "Authenticated successfully",
      data: {
        userId: req.user?.userId,
        organizationId: req.user?.organizationId,
      },
    });
  }
);

export default router;