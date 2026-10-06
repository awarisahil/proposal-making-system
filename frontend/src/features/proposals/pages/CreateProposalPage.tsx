import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getClients, type Client } from "../../../services/client.service";

import {
  createProposal,
} from "../../../services/proposal.service";

export default function CreateProposalPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);

  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState<
    "INR" | "USD" | "EUR" | "GBP"
  >("INR");

  const [validUntil, setValidUntil] = useState("");

  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoadingClients(true);
        setError("");

        const data = await getClients();

        setClients(data);
      } catch (err) {
        console.error("Failed to load clients:", err);
        setError("Failed to load clients.");
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!clientId) {
      setError("Please select a client.");
      return;
    }

    if (title.trim().length < 2) {
      setError(
        "Proposal title must be at least 2 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const proposal = await createProposal({
        clientId,
        title: title.trim(),
        description: description.trim() || undefined,
        currency,
        validUntil: validUntil || undefined,
      });

      navigate(`/proposals/${proposal.id}`);
    } catch (err) {
      console.error("Failed to create proposal:", err);

      setError(
        "Failed to create proposal. Please check your information and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/proposals"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Proposals
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-500">
            Proposal Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Create Proposal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start by entering the basic information for your
            proposal.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the core details of your proposal.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700"
              >
                Proposal Title
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Digital Marketing Proposal"
                maxLength={200}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                {title.length}/200 characters
              </p>
            </div>

            {/* Client */}
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-semibold text-slate-700"
              >
                Client
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                id="client"
                value={clientId}
                onChange={(event) =>
                  setClientId(event.target.value)
                }
                disabled={loadingClients}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingClients
                    ? "Loading clients..."
                    : "Select a client"}
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.companyName ||
                      client.displayName}
                  </option>
                ))}
              </select>

              {!loadingClients &&
                clients.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    No active clients are available.
                  </p>
                )}
            </div>

            {/* Currency + Valid Until */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Currency
                </label>

                <select
                  id="currency"
                  value={currency}
                  onChange={(event) =>
                    setCurrency(
                      event.target.value as
                        | "INR"
                        | "USD"
                        | "EUR"
                        | "GBP"
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                >
                  <option value="INR">
                    INR — Indian Rupee
                  </option>

                  <option value="USD">
                    USD — US Dollar
                  </option>

                  <option value="EUR">
                    EUR — Euro
                  </option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="validUntil"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Valid Until
                </label>

                <input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(event) =>
                    setValidUntil(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Optional proposal expiration date.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Briefly describe the purpose or scope of this proposal..."
                rows={6}
                maxLength={5000}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                {description.length}/5000 characters
              </p>
            </div>
          </div>
        </div>

        {/* Initial status */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
              i
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Proposal starts as Draft
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Your proposal will be created as a draft. You
                can add products, sections, pricing, and other
                content before sending it to the client.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/proposals"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting || loadingClients}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating Proposal..."
              : "Create Proposal"}
          </button>
        </div>
      </form>
    </div>
  );
}