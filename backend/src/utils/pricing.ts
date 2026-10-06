export interface PricingInput {
  quantity: number;
  unitPrice: number;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  taxRate: number;
}

export interface PricingResult {
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export function calculateItemPricing(
  input: PricingInput
): PricingResult {
  const grossAmount =
    input.quantity * input.unitPrice;

  let discountAmount = 0;

  if (input.discountType === "PERCENTAGE") {
    discountAmount =
      grossAmount * (input.discountValue / 100);
  } else {
    discountAmount = input.discountValue;
  }

  discountAmount = Math.min(
    Math.max(discountAmount, 0),
    grossAmount
  );

  const taxableAmount =
    grossAmount - discountAmount;

  const taxAmount =
    taxableAmount * (input.taxRate / 100);

  const total =
    taxableAmount + taxAmount;

  return {
    grossAmount: roundMoney(grossAmount),
    discountAmount: roundMoney(discountAmount),
    taxableAmount: roundMoney(taxableAmount),
    taxAmount: roundMoney(taxAmount),
    total: roundMoney(total),
  };
}

export function calculateProposalTotals(
  items: PricingResult[]
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.grossAmount,
    0
  );

  const discount = items.reduce(
    (sum, item) => sum + item.discountAmount,
    0
  );

  const tax = items.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  );

  const total = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return {
    subtotal: roundMoney(subtotal),
    discount: roundMoney(discount),
    tax: roundMoney(tax),
    total: roundMoney(total),
  };
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}