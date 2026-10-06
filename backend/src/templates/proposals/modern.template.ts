import type { ProposalTemplateData } from "./proposal-template.types.js";

export function renderModernProposal(
  data: ProposalTemplateData
): string {
  const primaryColor =
    data.organization.primaryColor || "#111827";

  const secondaryColor =
    data.organization.secondaryColor || "#6b7280";

  const sectionsHtml = data.sections
    .map(
      (section) => `
        <section class="section">
          <h2>${escapeHtml(section.title)}</h2>
          ${
            section.content
              ? `<p>${escapeHtml(section.content)}</p>`
              : ""
          }
        </section>
      `
    )
    .join("");

  const itemsHtml = data.items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>

          <td>
            <strong>${escapeHtml(item.name)}</strong>

            ${
              item.description
                ? `<div class="description">
                    ${escapeHtml(item.description)}
                  </div>`
                : ""
            }
          </td>

          <td>${escapeHtml(item.quantity)}</td>

          <td>${escapeHtml(item.unit)}</td>

          <td>₹${escapeHtml(item.unitPrice)}</td>

          <td>₹${escapeHtml(item.total)}</td>
        </tr>
      `
    )
    .join("");

  const organizationAddress = [
    data.organization.addressLine1,
    data.organization.addressLine2,
    data.organization.city,
    data.organization.state,
    data.organization.postalCode,
    data.organization.country,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ");

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
  font-size: 12px;
  line-height: 1.5;
}

.page {
  padding: 42px 48px;
}

/* =========================
   HEADER
========================= */

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  border-bottom: 3px solid ${primaryColor};

  padding-bottom: 20px;
  margin-bottom: 30px;
}

.company-wrapper {
  max-width: 65%;
}

.company-logo {
  display: block;

  width: auto;
  height: auto;

  max-width: 150px;
  max-height: 60px;

  object-fit: contain;

  margin-bottom: 10px;
}
.company {
  font-size: 24px;
  font-weight: 700;
  color: ${primaryColor};
}

.company-contact {
  margin-top: 7px;

  font-size: 9px;
  color: ${secondaryColor};
}

.company-contact span {
  margin-right: 12px;
}

.company-address {
  margin-top: 5px;

  font-size: 9px;
  color: ${secondaryColor};

  line-height: 1.4;
}

/* =========================
   PROPOSAL TITLE
========================= */

.proposal-label {
  text-align: right;
}

.proposal-label h1 {
  margin: 0;

  font-size: 28px;
  color: ${primaryColor};
}

.proposal-number {
  color: ${secondaryColor};

  margin-top: 4px;
}

/* =========================
   INFORMATION
========================= */

.info-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 30px;

  margin-bottom: 32px;
}

.info-title {
  font-size: 10px;
  font-weight: bold;

  text-transform: uppercase;

  color: ${secondaryColor};

  letter-spacing: 0.7px;

  margin-bottom: 7px;
}

.client-name {
  font-size: 15px;

  font-weight: bold;

  color: ${primaryColor};
}

.info p {
  margin: 3px 0;
}

/* =========================
   SECTIONS
========================= */

.section {
  margin-bottom: 25px;
}

.section h2 {
  font-size: 17px;

  margin: 0 0 8px;

  padding-bottom: 6px;

  color: ${primaryColor};

  border-bottom: 1px solid #e5e7eb;
}

.section p {
  margin: 0;

  white-space: pre-line;
}

/* =========================
   TABLE
========================= */

table {
  width: 100%;

  border-collapse: collapse;

  margin-top: 15px;
}

th {
  background: ${primaryColor};

  color: white;

  padding: 9px;

  text-align: left;
}

td {
  padding: 9px;

  border-bottom: 1px solid #e5e7eb;
}

.description {
  color: ${secondaryColor};

  font-size: 10px;

  margin-top: 3px;
}

/* =========================
   TOTALS
========================= */

.totals {
  width: 300px;

  margin-left: auto;

  margin-top: 20px;
}

.total-row {
  display: flex;

  justify-content: space-between;

  padding: 6px 0;
}

.total {
  border-top: 2px solid ${primaryColor};

  margin-top: 5px;

  padding-top: 10px;

  font-size: 16px;

  font-weight: bold;

  color: ${primaryColor};
}

/* =========================
   FOOTER
========================= */

.footer {
  margin-top: 45px;

  border-top: 1px solid #e5e7eb;

  padding-top: 15px;

  text-align: center;

  font-size: 10px;

  color: ${secondaryColor};
}

.footer-company {
  font-weight: bold;

  color: ${primaryColor};
}

</style>

</head>

<body>

<div class="page">

  <!-- =========================
       HEADER
  ========================== -->

  <div class="header">

    <div class="company-wrapper">

      ${
        data.organization.logoUrl
          ? `
            <img
              src="${escapeHtml(data.organization.logoUrl)}"
              class="company-logo"
            />
          `
          : ""
      }

      <div class="company">
        ${escapeHtml(data.organization.name)}
      </div>

      <div class="company-contact">

        ${
          data.organization.email
            ? `<span>${escapeHtml(data.organization.email)}</span>`
            : ""
        }

        ${
          data.organization.phone
            ? `<span>${escapeHtml(data.organization.phone)}</span>`
            : ""
        }

        ${
          data.organization.website
            ? `<span>${escapeHtml(data.organization.website)}</span>`
            : ""
        }

      </div>

      ${
        organizationAddress
          ? `
            <div class="company-address">
              ${organizationAddress}
            </div>
          `
          : ""
      }

    </div>

    <div class="proposal-label">

      <h1>
        PROPOSAL
      </h1>

      <div class="proposal-number">
        ${escapeHtml(data.proposalNumber)}
      </div>

    </div>

  </div>


  <!-- =========================
       CLIENT / PROPOSAL INFO
  ========================== -->

  <div class="info-grid">

    <div class="info">

      <div class="info-title">
        Prepared For
      </div>

      <div class="client-name">
        ${escapeHtml(data.client.companyName)}
      </div>

      <p>
        ${escapeHtml(data.client.displayName)}
      </p>

      ${
        data.client.email
          ? `<p>${escapeHtml(data.client.email)}</p>`
          : ""
      }

      ${
        data.client.phone
          ? `<p>${escapeHtml(data.client.phone)}</p>`
          : ""
      }

    </div>


    <div class="info">

      <div class="info-title">
        Proposal Details
      </div>

      <p>
        <strong>Title:</strong>
        ${escapeHtml(data.title)}
      </p>

      <p>
        <strong>Status:</strong>
        ${escapeHtml(data.status)}
      </p>

      ${
        data.validUntil
          ? `
            <p>
              <strong>Valid Until:</strong>
              ${escapeHtml(data.validUntil)}
            </p>
          `
          : ""
      }

    </div>

  </div>


  <!-- =========================
       DESCRIPTION
  ========================== -->

  ${
    data.description
      ? `
        <section class="section">

          <h2>
            Overview
          </h2>

          <p>
            ${escapeHtml(data.description)}
          </p>

        </section>
      `
      : ""
  }


  <!-- =========================
       CUSTOM SECTIONS
  ========================== -->

  ${sectionsHtml}


  <!-- =========================
       INVESTMENT
  ========================== -->

  <section class="section">

    <h2>
      Investment
    </h2>

    <table>

      <thead>

        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Unit</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>

      </thead>

      <tbody>

        ${itemsHtml}

      </tbody>

    </table>


    <div class="totals">

      <div class="total-row">

        <span>
          Subtotal
        </span>

        <span>
          ₹${escapeHtml(data.subtotal)}
        </span>

      </div>


      <div class="total-row">

        <span>
          Discount
        </span>

        <span>
          - ₹${escapeHtml(data.discount)}
        </span>

      </div>


      <div class="total-row">

        <span>
          Tax
        </span>

        <span>
          ₹${escapeHtml(data.tax)}
        </span>

      </div>


      <div class="total-row total">

        <span>
          Total
        </span>

        <span>
          ₹${escapeHtml(data.total)}
        </span>

      </div>

    </div>

  </section>


  <!-- =========================
       FOOTER
  ========================== -->

  <div class="footer">

    <div class="footer-company">
      ${escapeHtml(data.organization.name)}
    </div>

    <div>
      Proposal ${escapeHtml(data.proposalNumber)}
    </div>

  </div>

</div>

</body>
</html>
`;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}