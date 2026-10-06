import type { ProposalTemplateData } from "./proposal-template.types.js";

export function renderMinimalProposal(
  data: ProposalTemplateData
): string {
  const primaryColor =
    data.organization?.primaryColor || "#222222";

  const secondaryColor =
    data.organization?.secondaryColor || "#777777";

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

          <h2>
            ${escapeHtml(section.title)}
          </h2>

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

          <td>
            ${index + 1}
          </td>

          <td>

            <strong>
              ${escapeHtml(item.name)}
            </strong>

            ${
              item.description
                ? `
                  <div class="description">
                    ${escapeHtml(item.description)}
                  </div>
                `
                : ""
            }

          </td>

          <td>
            ${escapeHtml(item.quantity)}
          </td>

          <td>
            ₹${escapeHtml(item.unitPrice)}
          </td>

          <td>
            ₹${escapeHtml(item.total)}
          </td>

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
  margin: 18mm;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;
  font-size: 11px;
  line-height: 1.5;
}

.header {
  margin-bottom: 40px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 18px;
}

.company-area {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.company-logo {
  max-width: 130px;
  max-height: 55px;
  object-fit: contain;
}

.company {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${escapeHtml(primaryColor)};
}

.company-contact {
  margin-top: 7px;
  color: ${escapeHtml(secondaryColor)};
  font-size: 8.5px;
  line-height: 1.4;
}

.proposal {
  margin-top: 35px;
}

.proposal h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 400;
  color: ${escapeHtml(primaryColor)};
}

.proposal-number {
  margin-top: 6px;
  color: ${escapeHtml(secondaryColor)};
}

.client {
  margin-top: 35px;
}

.label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${escapeHtml(secondaryColor)};
  margin-bottom: 5px;
}

.client-name {
  font-size: 17px;
  font-weight: bold;
}

.client p {
  margin: 2px 0;
}

.section {
  margin-top: 35px;
}

.section h2 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${escapeHtml(primaryColor)};
}

.section p {
  margin: 0;
  white-space: pre-line;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th {
  text-align: left;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: ${escapeHtml(secondaryColor)};
  border-bottom: 2px solid ${escapeHtml(primaryColor)};
  padding: 8px 5px;
}

td {
  padding: 10px 5px;
  border-bottom: 1px solid #ddd;
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

.totals {
  width: 280px;
  margin-left: auto;
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
  margin-top: 50px;
  padding-top: 12px;
  border-top: 1px solid #ddd;
  color: ${escapeHtml(secondaryColor)};
  font-size: 9px;
  text-align: center;
}

</style>

</head>

<body>

<header class="header">

  <div class="company-area">

    ${logoHtml}

    <div>

      <div class="company">
        ${escapeHtml(data.organizationName)}
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

  <div class="proposal">

    <h1>
      ${escapeHtml(data.title)}
    </h1>

    <div class="proposal-number">
      ${escapeHtml(data.proposalNumber)}
    </div>

  </div>

  <div class="client">

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

</header>

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

${sectionsHtml}

<section class="section">

  <h2>
    Pricing
  </h2>

  <table>

    <thead>

      <tr>

        <th>
          #
        </th>

        <th>
          Item
        </th>

        <th>
          Qty
        </th>

        <th>
          Unit Price
        </th>

        <th>
          Total
        </th>

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

<footer class="footer">

  ${escapeHtml(data.organizationName)}

  ·

  ${escapeHtml(data.proposalNumber)}

</footer>

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