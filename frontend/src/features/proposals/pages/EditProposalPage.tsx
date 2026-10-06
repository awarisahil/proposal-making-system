import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getProposal,
  updateProposal,
  type Proposal,
} from "../../../services/proposal.service";

export default function EditProposalPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState<Proposal | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState<
    "INR" | "USD" | "EUR" | "GBP"
  >("INR");
  const [validUntil, setValidUntil] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid proposal ID");
      setLoading(false);
      return;
    }

    const loadProposal = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProposal(id);

        setProposal(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setCurrency(
          data.currency as "INR" | "USD" | "EUR" | "GBP"
        );

        if (data.validUntil) {
          setValidUntil(
            new Date(data.validUntil)
              .toISOString()
              .split("T")[0]
          );
        }
      } catch (err) {
        console.error("Failed to load proposal:", err);
        setError("Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [id]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      setError("Invalid proposal ID");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateProposal(id, {
        title,
        description,
        currency,
        validUntil: validUntil || undefined,
      });

      setSuccess("Proposal updated successfully.");

      setTimeout(() => {
        navigate(`/proposals/${id}`);
      }, 700);
    } catch (err) {
      console.error("Failed to update proposal:", err);
      setError("Failed to update proposal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading proposal...
        </p>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="space-y-4">
        <Link
          to="/proposals"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to Proposals
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/proposals/${id}`}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to Proposal
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Proposal
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the basic information of{" "}
            <span className="font-semibold text-slate-700">
              {proposal?.proposalNumber}
            </span>
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Proposal Information
          </h2>

          <div className="mt-6 space-y-5">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Proposal Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
                maxLength={200}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="Enter proposal title"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                maxLength={5000}
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                placeholder="Enter proposal description"
              />
            </div>

            {/* Currency + Valid Until */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-slate-700"
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
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="INR">INR — Indian Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="validUntil"
                  className="block text-sm font-medium text-slate-700"
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
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/proposals/${id}`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}