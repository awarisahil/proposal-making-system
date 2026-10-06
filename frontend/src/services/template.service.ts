import api from "./api";

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  preview: boolean;
}

interface TemplatesResponse {
  success: boolean;
  data: ProposalTemplate[];
}

export const getProposalTemplates = async (): Promise<
  ProposalTemplate[]
> => {
  const response = await api.get<TemplatesResponse>(
    "/proposals/templates"
  );

  return response.data.data;
};