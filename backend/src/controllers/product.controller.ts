import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createProductCategory,
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

import {
  createProductCategorySchema,
  updateProductCategorySchema,
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";
function getParamId(req: Request): string {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid resource ID");
  }

  return id;
}
function validationErrors(error: any) {
  return error.issues.map((issue: any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function createProductCategoryController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = createProductCategorySchema.safeParse(
      req.body
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const category = await createProductCategory(
      req.user.organizationId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Product category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create product category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product category",
    });
  }
}

export async function getProductCategoriesController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const categories = await getProductCategories(
      req.user.organizationId
    );

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get product categories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product categories",
    });
  }
}

export async function getProductCategoryController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const category = await getProductCategoryById(
      req.user.organizationId,
      getParamId(req)
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Product category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get product category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product category",
    });
  }
}

export async function updateProductCategoryController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = updateProductCategorySchema.safeParse(
      req.body
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const category = await updateProductCategory(
      req.user.organizationId,
      getParamId(req),
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Product category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update product category error:", error);

    if (
      error instanceof Error &&
      error.message === "Product category not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update product category",
    });
  }
}

export async function deleteProductCategoryController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    await deleteProductCategory(
      req.user.organizationId,
      getParamId(req)
    );

    res.status(200).json({
      success: true,
      message: "Product category archived successfully",
    });
  } catch (error) {
    console.error("Delete product category error:", error);

    if (
      error instanceof Error &&
      error.message === "Product category not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to archive product category",
    });
  }
}

export async function createProductController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = createProductSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const product = await createProduct(
      req.user.organizationId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    if (
      error instanceof Error &&
      error.message === "Product category not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
}

export async function getProductsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const products = await getProducts(
      req.user.organizationId
    );

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
}

export async function getProductController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const product = await getProductById(
      req.user.organizationId,
      getParamId(req)
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
}

export async function updateProductController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors(validation.error),
      });
      return;
    }

    const product = await updateProduct(
      req.user.organizationId,
      getParamId(req),
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Product not found" ||
        error.message === "Product category not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
}

export async function deleteProductController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    await deleteProduct(
      req.user.organizationId,
      getParamId(req)
    );

    res.status(200).json({
      success: true,
      message: "Product archived successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    if (
      error instanceof Error &&
      error.message === "Product not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to archive product",
    });
  }
}