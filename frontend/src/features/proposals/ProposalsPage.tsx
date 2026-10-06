import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteProposal,
  getProposals,
  type Proposal,
} from "../../services/proposal.service";

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

    case "DRAFT":
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-600/10";

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

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProposals();

      setProposals(data);
    } catch (err) {
      console.error("Failed to load proposals:", err);
      setError("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const filteredProposals = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return proposals.filter((proposal) => {
      const matchesSearch =
        !normalizedSearch ||
        proposal.proposalNumber
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        proposal.title?.toLowerCase().includes(normalizedSearch) ||
        proposal.client?.companyName
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        proposal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [proposals, search, statusFilter]);

  const handleDelete = async (proposal: Proposal) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete proposal ${proposal.proposalNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(proposal.id);

      await deleteProposal(proposal.id);

      setProposals((current) =>
        current.filter((item) => item.id !== proposal.id)
      );
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      setError("Failed to delete proposal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Proposal Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Proposals
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create, manage, track, and organize your proposals.
          </p>
        </div>

        <Link
          to="/proposals/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <span className="text-lg leading-none">+</span>
          Create Proposal
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search proposals, clients..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="INTERNAL_REVIEW">
              Internal Review
            </option>
            <option value="APPROVED">Approved</option>
            <option value="SENT">Sent</option>
            <option value="VIEWED">Viewed</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={loadProposals}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Proposals
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {proposals.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Accepted
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {
              proposals.filter(
                (proposal) => proposal.status === "ACCEPTED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pipeline Value
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(
              proposals.reduce(
                (sum, proposal) =>
                  sum + Number(proposal.total),
                0
              )
            )}
          </p>
        </div>
      </div>

      {/* Proposal table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              All Proposals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProposals.length} proposal
              {filteredProposals.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-slate-500">
              Loading proposals...
            </p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📄
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No proposals found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search || statusFilter !== "ALL"
                ? "Try changing your search or filter."
                : "Create your first proposal to get started."}
            </p>

            {!search && statusFilter === "ALL" && (
              <Link
                to="/proposals/new"
                className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Create Proposal
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
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

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {proposal.proposalNumber}
                      </p>

                      <p className="mt-1 max-w-sm truncate text-sm text-slate-500">
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

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/proposals/${proposal.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View
                        </Link>

                        <Link
                          to={`/proposals/${proposal.id}/edit`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(proposal)
                          }
                          disabled={deletingId === proposal.id}
                          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === proposal.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}