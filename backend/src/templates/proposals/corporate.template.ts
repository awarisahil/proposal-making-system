import type { ProposalTemplateData } from "./proposal-template.types.js";

export function renderCorporateProposal(
  data: ProposalTemplateData
): string {
  const primaryColor =
    data.organization?.primaryColor || "#1f4e79";

  const secondaryColor =
    data.organization?.secondaryColor || "#6b7280";

  const logoUrl =
    data.organization?.logoUrl || "";

  const organizationEmail =
    data.organization?.email || "";

  const organizationPhone =
    data.organization?.phone || "";

  const organizationWebsite =
    data.organization?.website || "";

const organizationAddress = [
  data.organization?.addressLine1,
  data.organization?.addressLine2,
  data.organization?.city,
  data.organization?.state,
  data.organization?.postalCode,
  data.organization?.country,
]
  .filter(Boolean)
  .join(", ");

  const logoHtml = logoUrl
    ? `
      <img
        src="${escapeHtml(logoUrl)}"
        class="company-logo"
        alt="${escapeHtml(data.organizationName)}"
      />
    `
    : "";

  const organizationContactHtml = `
    ${
      organizationEmail
        ? `<div>${escapeHtml(organizationEmail)}</div>`
        : ""
    }

    ${
      organizationPhone
        ? `<div>${escapeHtml(organizationPhone)}</div>`
        : ""
    }

    ${
      organizationWebsite
        ? `<div>${escapeHtml(organizationWebsite)}</div>`
        : ""
    }

    ${
      organizationAddress
        ? `<div>${escapeHtml(organizationAddress)}</div>`
        : ""
    }
  `;

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

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<style>

@page {
  size: A4;
  margin: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
  font-size: 11px;
  line-height: 1.5;
}

.page {
  padding: 45px 50px;
}

.header {
  border-bottom: 4px solid ${escapeHtml(primaryColor)};
  padding-bottom: 18px;
  margin-bottom: 28px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.company-area {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.company-logo {
  max-width: 150px;
  max-height: 65px;
  object-fit: contain;
}

.company {
  font-size: 25px;
  font-weight: 700;
  color: ${escapeHtml(primaryColor)};
}

.company-subtitle {
  margin-top: 4px;
  color: ${escapeHtml(secondaryColor)};
  font-size: 10px;
}

.company-contact {
  margin-top: 8px;
  color: ${escapeHtml(secondaryColor)};
  font-size: 8.5px;
  line-height: 1.4;
}

.document {
  text-align: right;
}

.document-title {
  font-size: 26px;
  font-weight: 700;
  color: ${escapeHtml(primaryColor)};
  letter-spacing: 1px;
}

.document-number {
  margin-top: 4px;
  color: ${escapeHtml(secondaryColor)};
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.info-box {
  border-left: 3px solid ${escapeHtml(primaryColor)};
  padding-left: 12px;
}

.label {
  font-size: 9px;
  text-transform: uppercase;
  font-weight: bold;
  color: ${escapeHtml(secondaryColor)};
  letter-spacing: 0.8px;
  margin-bottom: 5px;
}

.client-name {
  font-size: 15px;
  font-weight: bold;
  color: #111827;
}

.info p {
  margin: 3px 0;
}

.section {
  margin-bottom: 25px;
}

.section h2 {
  color: ${escapeHtml(primaryColor)};
  font-size: 16px;
  margin: 0 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #d1d5db;
}

.section p {
  margin: 0;
  white-space: pre-line;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

thead {
  display: table-header-group;
}

th {
  background: ${escapeHtml(primaryColor)};
  color: white;
  padding: 9px 8px;
  text-align: left;
  font-size: 10px;
}

td {
  padding: 9px 8px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}

tr {
  page-break-inside: avoid;
}

.description {
  color: ${escapeHtml(secondaryColor)};
  font-size: 9px;
  margin-top: 3px;
}

.totals-wrapper {
  display: flex;
  justify-content: flex-end;
}

.totals {
  width: 290px;
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.total {
  border-top: 2px solid ${escapeHtml(primaryColor)};
  margin-top: 5px;
  padding-top: 9px;
  font-size: 15px;
  font-weight: bold;
  color: ${escapeHtml(primaryColor)};
}

.footer {
  margin-top: 45px;
  padding-top: 12px;
  border-top: 1px solid #d1d5db;
  display: flex;
  justify-content: space-between;
  color: ${escapeHtml(secondaryColor)};
  font-size: 9px;
}

.status {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid ${escapeHtml(primaryColor)};
  color: ${escapeHtml(primaryColor)};
  font-size: 9px;
  font-weight: bold;
}

</style>

</head>

<body>

<div class="page">

  <header class="header">

    <div class="header-top">

      <div class="company-area">

        ${logoHtml}

        <div>

          <div class="company">
            ${escapeHtml(data.organizationName)}
          </div>

          <div class="company-subtitle">
            Business Proposal
          </div>

          ${
            organizationEmail ||
            organizationPhone ||
            organizationWebsite ||
            organizationAddress
              ? `
                <div class="company-contact">
                  ${organizationContactHtml}
                </div>
              `
              : ""
          }

        </div>

      </div>

      <div class="document">

        <div class="document-title">
          PROPOSAL
        </div>

        <div class="document-number">
          ${escapeHtml(data.proposalNumber)}
        </div>

      </div>

    </div>

  </header>

  <div class="info-grid">

    <div class="info-box">

      <div class="label">
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

      ${
        data.client.city
          ? `<p>
              ${escapeHtml(data.client.city)}
              ${
                data.client.state
                  ? `, ${escapeHtml(data.client.state)}`
                  : ""
              }
            </p>`
          : ""
      }

    </div>

    <div class="info-box">

      <div class="label">
        Proposal Information
      </div>

      <p>
        <strong>Title:</strong>
        ${escapeHtml(data.title)}
      </p>

      <p>
        <strong>Status:</strong>

        <span class="status">
          ${escapeHtml(data.status)}
        </span>
      </p>

      ${
        data.validUntil
          ? `<p>
              <strong>Valid Until:</strong>
              ${escapeHtml(data.validUntil)}
            </p>`
          : ""
      }

    </div>

  </div>

  ${
    data.description
      ? `
        <section class="section">

          <h2>Executive Overview</h2>

          <p>
            ${escapeHtml(data.description)}
          </p>

        </section>
      `
      : ""
  }

  ${sectionsHtml}

  <section class="section">

    <h2>Commercial Details</h2>

    <table>

      <thead>

        <tr>
          <th>#</th>
          <th>Description</th>
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

    <div class="totals-wrapper">

      <div class="totals">

        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${escapeHtml(data.subtotal)}</span>
        </div>

        <div class="total-row">
          <span>Discount</span>
          <span>- ₹${escapeHtml(data.discount)}</span>
        </div>

        <div class="total-row">
          <span>Tax</span>
          <span>₹${escapeHtml(data.tax)}</span>
        </div>

        <div class="total-row total">
          <span>Total</span>
          <span>₹${escapeHtml(data.total)}</span>
        </div>

      </div>

    </div>

  </section>

  <footer class="footer">

    <span>
      ${escapeHtml(data.organizationName)}
    </span>

    <span>
      ${escapeHtml(data.proposalNumber)}
    </span>

  </footer>

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