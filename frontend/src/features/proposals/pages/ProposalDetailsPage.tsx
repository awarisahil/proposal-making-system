import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProposal,
  addProposalItem,
  type Proposal,
  type CreateProposalItemInput,
} from "../../../services/proposal.service";

import {
  getProducts,
  type Product,
} from "../../../services/product.service";

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

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
      return "bg-slate-100 text-slate-700";
  }
}

function formatCurrency(
  value: string | number,
  currency = "INR"
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProposalDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [proposal, setProposal] =
    useState<Proposal | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [itemError, setItemError] = useState("");

  const [showAddItem, setShowAddItem] =
    useState(false);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [quantity, setQuantity] = useState("1");

  const [addingItem, setAddingItem] =
    useState(false);

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
      } catch (err) {
        console.error(
          "Failed to load proposal:",
          err
        );

        setError("Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [id]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setItemError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setItemError("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenAddItem = async () => {
    setShowAddItem(true);
    setItemError("");

    if (products.length === 0) {
      await loadProducts();
    }
  };

  const handleAddItem = async () => {
    if (!id) {
      setItemError("Invalid proposal ID");
      return;
    }

    if (!selectedProductId) {
      setItemError("Please select a product");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      setItemError("Quantity must be greater than 0");
      return;
    }

    try {
      setAddingItem(true);
      setItemError("");

      const selectedProduct = products.find(
        (product) =>
          product.id === selectedProductId
      );

      if (!selectedProduct) {
        setItemError("Selected product not found");
        return;
      }

      const input: CreateProposalItemInput = {
        productId: selectedProduct.id,
        type: "PRODUCT",
        name: selectedProduct.name,
        description:
          selectedProduct.description ?? undefined,
        quantity: parsedQuantity,
        unit: selectedProduct.unit,
        unitPrice: Number(selectedProduct.price),
        discountType: "FIXED",
        discountValue: 0,
        taxRate: Number(selectedProduct.taxRate),
      };

      await addProposalItem(id, input);

      const refreshedProposal =
        await getProposal(id);

      setProposal(refreshedProposal);

      setSelectedProductId("");
      setQuantity("1");
      setShowAddItem(false);
    } catch (err) {
      console.error(
        "Failed to add proposal item:",
        err
      );

      setItemError(
        "Failed to add item to proposal"
      );
    } finally {
      setAddingItem(false);
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

  if (error || !proposal) {
    return (
      <div className="space-y-4">
        <Link
          to="/proposals"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to Proposals
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Proposal not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <Link
            to="/proposals"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Proposals
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {proposal.proposalNumber}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                proposal.status
              )}`}
            >
              {formatStatus(proposal.status)}
            </span>
          </div>

          <p className="mt-2 text-lg font-medium text-slate-700">
            {proposal.title}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/proposals/${proposal.id}/edit`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* ================================================== */}
      {/* BASIC INFORMATION */}
      {/* ================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Client */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Client
          </h2>

          <div className="mt-5 space-y-3">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Company
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {proposal.client?.companyName ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Contact
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {proposal.client?.displayName ?? "—"}
              </p>
            </div>

            {proposal.client?.email && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {proposal.client.email}
                </p>
              </div>
            )}

            {proposal.client?.phone && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {proposal.client.phone}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Proposal information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Proposal Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(proposal.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Valid Until
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(proposal.validUntil)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Currency
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {proposal.currency}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(proposal.updatedAt)}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ================================================== */}
      {/* DESCRIPTION */}
      {/* ================================================== */}

      {proposal.description && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {proposal.description}
          </p>

        </div>
      )}

      {/* ================================================== */}
      {/* PROPOSAL ITEMS */}
      {/* ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Proposal Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products and services included in this proposal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddItem}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add Item
          </button>

        </div>

        {/* Add Item Form */}

        {showAddItem && (
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-6">

            <div className="max-w-2xl">

              <h3 className="text-base font-semibold text-slate-900">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select a product from your product catalog and add it to this proposal.
              </p>

              {itemError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {itemError}
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* Product */}

                <div className="sm:col-span-2">

                  <label className="block text-sm font-medium text-slate-700">
                    Product
                  </label>

                  <select
                    value={selectedProductId}
                    onChange={(event) =>
                      setSelectedProductId(
                        event.target.value
                      )
                    }
                    disabled={productsLoading}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">
                      {productsLoading
                        ? "Loading products..."
                        : "Select a product"}
                    </option>

                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.name} —{" "}
                        {formatCurrency(
                          product.price,
                          proposal.currency
                        )}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Quantity */}

                <div>

                  <label className="block text-sm font-medium text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />

                </div>

              </div>

              {/* Selected product preview */}

              {selectedProductId && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">

                  {(() => {
                    const selectedProduct =
                      products.find(
                        (product) =>
                          product.id ===
                          selectedProductId
                      );

                    if (!selectedProduct) {
                      return null;
                    }

                    return (
                      <div className="grid gap-3 sm:grid-cols-3">

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Product
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {selectedProduct.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Unit Price
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {formatCurrency(
                              selectedProduct.price,
                              proposal.currency
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Tax
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {Number(
                              selectedProduct.taxRate
                            )}
                            %
                          </p>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* Actions */}

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={
                    addingItem ||
                    productsLoading
                  }
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingItem
                    ? "Adding..."
                    : "Add Item"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setItemError("");
                    setSelectedProductId("");
                    setQuantity("1");
                  }}
                  disabled={addingItem}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}

        {/* Items Table */}

        {!proposal.items?.length ? (
          <div className="px-6 py-12 text-center">

            <p className="text-sm text-slate-500">
              No items have been added to this proposal yet.
            </p>

            <button
              type="button"
              onClick={handleOpenAddItem}
              className="mt-4 text-sm font-semibold text-slate-900 hover:underline"
            >
              Add your first item
            </button>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Item
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Qty
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Unit Price
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tax
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>

                </tr>
              </thead>

              <tbody>

                {proposal.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0"
                  >

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-900">
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      )}

                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {Number(item.quantity)}{" "}
                      {item.unit}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {formatCurrency(
                        item.unitPrice,
                        proposal.currency
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {Number(item.taxRate)}%
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(
                        item.total,
                        proposal.currency
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ================================================== */}
      {/* SECTIONS */}
      {/* ================================================== */}

      {proposal.sections &&
        proposal.sections.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Proposal Sections
            </h2>

            <div className="mt-5 space-y-6">

              {proposal.sections.map((section) => (
                <div key={section.id}>

                  <h3 className="font-semibold text-slate-900">
                    {section.title}
                  </h3>

                  {section.content && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {section.content}
                    </p>
                  )}

                </div>
              ))}

            </div>

          </div>
        )}

      {/* ================================================== */}
      {/* TOTALS */}
      {/* ================================================== */}

      <div className="flex justify-end">

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Summary
          </h2>

          <div className="mt-5 space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(
                  proposal.subtotal,
                  proposal.currency
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(
                  proposal.discount,
                  proposal.currency
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Tax
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(
                  proposal.tax,
                  proposal.currency
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">

              <div className="flex justify-between">

                <span className="text-base font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(
                    proposal.total,
                    proposal.currency
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}