import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createProductCategoryController,
  getProductCategoriesController,
  getProductCategoryController,
  updateProductCategoryController,
  deleteProductCategoryController,
  createProductController,
  getProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

const router = Router();

router.use(authenticate);

// Categories
router.post(
  "/categories",
  createProductCategoryController
);

router.get(
  "/categories",
  getProductCategoriesController
);

router.get(
  "/categories/:id",
  getProductCategoryController
);

router.put(
  "/categories/:id",
  updateProductCategoryController
);

router.delete(
  "/categories/:id",
  deleteProductCategoryController
);

// Products
router.post(
  "/",
  createProductController
);

router.get(
  "/",
  getProductsController
);

router.get(
  "/:id",
  getProductController
);

router.put(
  "/:id",
  updateProductController
);

router.delete(
  "/:id",
  deleteProductController
);

export default router;