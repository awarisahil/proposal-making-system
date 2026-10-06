import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import {
  getProposals,
  type Proposal,
} from "../../services/proposal.service";

import { getClients } from "../../services/client.service";
import { getProducts } from "../../services/product.service";

function getStatusClasses(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20";

    case "APPROVED":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-600/20";

    case "SENT":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20";

    case "VIEWED":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20";

    case "INTERNAL_REVIEW":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20";

    case "REJECTED":
      return "bg-red-50 text-red-700 ring-1 ring-red-600/20";

    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-600/10";
  }
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: string | number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function DashboardPage() {
  const { user, organization, roles } = useAuth();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [proposalData, clients, products] =
          await Promise.all([
            getProposals(),
            getClients(),
            getProducts(),
          ]);

        setProposals(proposalData);
        setClientCount(clients.length);
        setProductCount(products.length);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const proposalCount = proposals.length;

  const acceptedRevenue = proposals
    .filter((proposal) => proposal.status === "ACCEPTED")
    .reduce(
      (sum, proposal) => sum + Number(proposal.total),
      0
    );

  const stats = [
    {
      title: "Clients",
      value: clientCount,
      description: "Active clients",
      icon: "C",
    },
    {
      title: "Products",
      value: productCount,
      description: "Products & services",
      icon: "P",
    },
    {
      title: "Proposals",
      value: proposalCount,
      description: "Total proposals",
      icon: "Q",
    },
    {
      title: "Revenue",
      value: formatCurrency(acceptedRevenue),
      description: "From accepted proposals",
      icon: "₹",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.firstName}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your proposals today.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Organization
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {organization?.name}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {loading ? "..." : stat.value}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Proposals */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Proposals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest proposals in your organization
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {proposalCount} total
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            Loading proposals...
          </div>
        ) : proposals.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-medium text-slate-700">
              No proposals yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first proposal to see it here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Proposal
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {proposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {proposal.proposalNumber}
                      </p>

                      <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                        {proposal.title}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {proposal.client?.companyName ?? "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          proposal.status
                        )}`}
                      >
                        {formatStatus(proposal.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(proposal.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account / Role */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Account Access
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current roles and permissions
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {role.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}