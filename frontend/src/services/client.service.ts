import api from "./api";

export interface Client {
  id: string;
  organizationId: string;
  companyName: string;
  displayName: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  status: string;
}

interface ClientsResponse {
  success: boolean;
  data: Client[];
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get<ClientsResponse>("/clients");

  return response.data.data;
};