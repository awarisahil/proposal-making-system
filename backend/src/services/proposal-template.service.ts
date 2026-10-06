export const proposalTemplates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean modern proposal layout",
    preview: true,
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional corporate proposal layout",
    preview: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant proposal layout",
    preview: true,
  },
] as const;

export type ProposalTemplateId =
  (typeof proposalTemplates)[number]["id"];

export function getProposalTemplates() {
  return proposalTemplates;
}

export function isValidProposalTemplate(
  template: string
): template is ProposalTemplateId {
  return proposalTemplates.some(
    (item) => item.id === template
  );
}