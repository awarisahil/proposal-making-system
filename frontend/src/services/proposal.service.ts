import api from "./api";
export interface Proposal {
  id: string;
  organizationId: string;
  clientId: string;

  proposalNumber: string;
  title: string;
  description?: string | null;

  status: string;
  currency: string;
  validUntil?: string | null;

  subtotal: string;
  discount: string;
  tax: string;
  total: string;

  createdAt: string;
  updatedAt: string;

  client?: {
    id: string;
    companyName: string;
    displayName: string;
    email?: string | null;
    phone?: string | null;
  };

  sections?: ProposalSection[];

  items?: ProposalItem[];
}

export interface ProposalSection {
  id: string;
  proposalId: string;
  title: string;
  content?: string | null;
  sortOrder: number;
}

export interface ProposalItem {
  id: string;
  proposalId: string;

  productId?: string | null;
  type: string;

  name: string;
  description?: string | null;

  quantity: string | number;
  unit: string;

  unitPrice: string | number;

  discountType: string;
  discountValue: string | number;

  taxRate: string | number;
  subtotal: string | number;
  taxAmount: string | number;
  total: string | number;

  sortOrder: number;

  product?: {
    id: string;
    name: string;
    description?: string | null;
  };
}
export interface CreateProposalInput {
  clientId: string;
  title: string;
  description?: string;
  currency?: "INR" | "USD" | "EUR" | "GBP";
  validUntil?: string;
}
export interface CreateProposalItemInput {
  productId?: string;
  type?: "PRODUCT" | "CUSTOM";

  name: string;
  description?: string;

  quantity: number;
  unit?: string;

  unitPrice: number;

  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;

  taxRate?: number;
  sortOrder?: number;
}
interface ProposalsResponse {
  success: boolean;
  data: Proposal[];
}

interface ProposalResponse {
  success: boolean;
  data: Proposal;
}

export const getProposals = async (): Promise<Proposal[]> => {
  const response = await api.get<ProposalsResponse>("/proposals");

  return response.data.data;
};

export const createProposal = async (
  data: CreateProposalInput
): Promise<Proposal> => {
  const response = await api.post<ProposalResponse>(
    "/proposals",
    data
  );

  return response.data.data;
};

export const deleteProposal = async (
  proposalId: string
): Promise<void> => {
  await api.delete(`/proposals/${proposalId}`);
};

export const getProposal = async (
  id: string
): Promise<Proposal> => {
  const response = await api.get<{
    success: boolean;
    data: Proposal;
  }>(`/proposals/${id}`);

  return response.data.data;
};
export const updateProposal = async (
  id: string,
  data: Partial<CreateProposalInput>
): Promise<Proposal> => {
  const response = await api.put<ProposalResponse>(
    `/proposals/${id}`,
    data
  );

  return response.data.data;
};

export const addProposalItem = async (
  proposalId: string,
  data: CreateProposalItemInput
): Promise<ProposalItem> => {
  const response = await api.post<{
    success: boolean;
    data: ProposalItem;
  }>(`/proposals/${proposalId}/items`, data);

  return response.data.data;
};

export const updateProposalItem = async (
  proposalId: string,
  itemId: string,
  data: Partial<CreateProposalItemInput>
): Promise<ProposalItem> => {
  const response = await api.put<{
    success: boolean;
    data: ProposalItem;
  }>(
    `/proposals/${proposalId}/items/${itemId}`,
    data
  );

  return response.data.data;
};

export const deleteProposalItem = async (
  proposalId: string,
  itemId: string
): Promise<void> => {
  await api.delete(
    `/proposals/${proposalId}/items/${itemId}`
  );
};