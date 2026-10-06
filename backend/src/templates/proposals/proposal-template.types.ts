export interface ProposalTemplateData {
  organizationName: string;
  proposalNumber: string;
  title: string;
  description?: string | null;
organization: {
  name: string;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;

  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;

  primaryColor: string | null;
  secondaryColor: string | null;
};
  client: {
    companyName: string;
    displayName: string | null;
    email?: string | null;
    phone?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };

  validUntil?: string | null;
  status: string;

  sections: {
    title: string;
    content?: string | null;
  }[];

  items: {
    name: string;
    description?: string | null;
    quantity: string;
    unit: string;
    unitPrice: string;
    total: string;
  }[];

  subtotal: string;
  discount: string;
  tax: string;
  total: string;
}