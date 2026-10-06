import { prisma } from "../config/database.js";

import type {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
  CreateProductInput,
  UpdateProductInput,
} from "../validators/product.validator.js";

export async function createProductCategory(
  organizationId: string,
  data: CreateProductCategoryInput
) {
  return prisma.productCategory.create({
    data: {
      organizationId,
      name: data.name,
      description: data.description,
      isActive: data.isActive ?? true,
    },
  });
}

export async function getProductCategories(
  organizationId: string
) {
  return prisma.productCategory.findMany({
    where: {
      organizationId,
    },

    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
}

export async function getProductCategoryById(
  organizationId: string,
  categoryId: string
) {
  return prisma.productCategory.findFirst({
    where: {
      id: categoryId,
      organizationId,
    },

    include: {
      products: true,
    },
  });
}

export async function updateProductCategory(
  organizationId: string,
  categoryId: string,
  data: UpdateProductCategoryInput
) {
  const category = await prisma.productCategory.findFirst({
    where: {
      id: categoryId,
      organizationId,
    },
  });

  if (!category) {
    throw new Error("Product category not found");
  }

  return prisma.productCategory.update({
    where: {
      id: category.id,
    },

    data,
  });
}

export async function deleteProductCategory(
  organizationId: string,
  categoryId: string
) {
  const category = await prisma.productCategory.findFirst({
    where: {
      id: categoryId,
      organizationId,
    },
  });

  if (!category) {
    throw new Error("Product category not found");
  }

  await prisma.productCategory.update({
    where: {
      id: category.id,
    },

    data: {
      isActive: false,
    },
  });
}

export async function createProduct(
  organizationId: string,
  data: CreateProductInput
) {
  if (data.categoryId) {
    const category = await prisma.productCategory.findFirst({
      where: {
        id: data.categoryId,
        organizationId,
      },
    });

    if (!category) {
      throw new Error("Product category not found");
    }
  }

  return prisma.product.create({
    data: {
      organizationId,
      categoryId: data.categoryId,

      name: data.name,
      sku: data.sku || null,
      description: data.description,

      unit: data.unit ?? "unit",

      price: data.price,
      taxRate: data.taxRate ?? 0,

      isActive: data.isActive ?? true,
    },

    include: {
      category: true,
    },
  });
}

export async function getProducts(
  organizationId: string
) {
  return prisma.product.findMany({
    where: {
      organizationId,
    },

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(
  organizationId: string,
  productId: string
) {
  return prisma.product.findFirst({
    where: {
      id: productId,
      organizationId,
    },

    include: {
      category: true,
    },
  });
}

export async function updateProduct(
  organizationId: string,
  productId: string,
  data: UpdateProductInput
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      organizationId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.categoryId) {
    const category = await prisma.productCategory.findFirst({
      where: {
        id: data.categoryId,
        organizationId,
      },
    });

    if (!category) {
      throw new Error("Product category not found");
    }
  }

  return prisma.product.update({
    where: {
      id: product.id,
    },

    data: {
      ...data,

      sku:
        data.sku === undefined
          ? undefined
          : data.sku || null,
    },

    include: {
      category: true,
    },
  });
}

export async function deleteProduct(
  organizationId: string,
  productId: string
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      organizationId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: {
      id: product.id,
    },

    data: {
      isActive: false,
    },
  });
}