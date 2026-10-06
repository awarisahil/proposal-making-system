import api from "./api";

export interface Product {
  id: string;
  organizationId: string;
  categoryId?: string | null;
  name: string;
  sku: string;
  description?: string | null;
  unit: string;
  price: string;
  taxRate: string;
  isActive: boolean;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductsResponse>("/products");

  return response.data.data;
};