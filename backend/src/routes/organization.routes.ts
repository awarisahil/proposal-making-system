import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  uploadOrganizationLogoController,
} from "../controllers/organization.controller.js";

import {
  uploadOrganizationLogo,
} from "../middleware/upload.middleware.js";
import {
  getOrganizationController,
  updateOrganizationController,
} from "../controllers/organization.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getOrganizationController
);
router.post(
  "/logo",
  uploadOrganizationLogo.single("logo"),
  uploadOrganizationLogoController
);
router.put(
  "/",
  updateOrganizationController
);

export default router;