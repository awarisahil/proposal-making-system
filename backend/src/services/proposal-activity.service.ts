import { prisma } from "../config/database.js";
export async function getProposalActivities(
  organizationId: string,
  proposalId: string
) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  return prisma.proposalActivity.findMany({
    where: {
      proposalId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}