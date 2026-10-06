import { prisma } from "../config/database.js";

type WorkflowAction =
  | "SUBMIT_FOR_REVIEW"
  | "APPROVE"
  | "SEND"
  | "MARK_VIEWED"
  | "ACCEPT"
  | "REJECT"
  | "CANCEL"
  | "RETURN_TO_DRAFT";

const allowedTransitions: Record<
  WorkflowAction,
  {
    from: string[];
    to: string;
  }
> = {
  SUBMIT_FOR_REVIEW: {
    from: ["DRAFT"],
    to: "INTERNAL_REVIEW",
  },

  APPROVE: {
    from: ["INTERNAL_REVIEW"],
    to: "APPROVED",
  },

  SEND: {
    from: ["APPROVED"],
    to: "SENT",
  },

  MARK_VIEWED: {
    from: ["SENT"],
    to: "VIEWED",
  },

  ACCEPT: {
    from: ["SENT", "VIEWED"],
    to: "ACCEPTED",
  },

  REJECT: {
    from: ["SENT", "VIEWED"],
    to: "REJECTED",
  },

  CANCEL: {
    from: [
      "DRAFT",
      "INTERNAL_REVIEW",
      "APPROVED",
      "SENT",
      "VIEWED",
    ],
    to: "CANCELLED",
  },

  RETURN_TO_DRAFT: {
    from: ["INTERNAL_REVIEW"],
    to: "DRAFT",
  },
};

export async function changeProposalStatus(
  organizationId: string,
  proposalId: string,
  userId: string,
  action: WorkflowAction,
  description?: string
) {
  const transition = allowedTransitions[action];

  if (!transition) {
    throw new Error("Invalid workflow action");
  }

  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (!transition.from.includes(proposal.status)) {
    throw new Error(
      `Cannot perform ${action} when proposal status is ${proposal.status}`
    );
  }

  const now = new Date();

  const result = await prisma.$transaction(
    async (tx) => {
      const updatedProposal =
        await tx.proposal.update({
          where: {
            id: proposal.id,
          },

          data: {
            status: transition.to as any,
          },
        });

      await tx.proposalActivity.create({
        data: {
          proposalId: proposal.id,
          userId,

          action,

          description:
            description ??
            `Proposal status changed from ${proposal.status} to ${transition.to}`,

          metadata: {
            fromStatus: proposal.status,
            toStatus: transition.to,
            action,
            timestamp: now.toISOString(),
          },
        },
      });

      return updatedProposal;
    }
  );

  return result;
}