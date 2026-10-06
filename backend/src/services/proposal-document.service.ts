import { prisma } from "../config/database.js";
import puppeteer from "puppeteer";
import { renderModernProposal } from "../templates/proposals/modern.template.js";
import { renderCorporateProposal } from "../templates/proposals/corporate.template.js";
import type { ProposalTemplateData } from "../templates/proposals/proposal-template.types.js";
import { renderMinimalProposal } from "../templates/proposals/minimal.template.js";
import fs from "node:fs/promises";
import path from "node:path";
export type ProposalTemplate =
  | "modern"
  | "corporate"
  | "minimal";
async function getLogoDataUri(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) {
    return null;
  }

  try {
    const relativePath = logoUrl.replace(/^\/+/, "");

    const filePath = path.resolve(process.cwd(), relativePath);

    const fileBuffer = await fs.readFile(filePath);

    const extension = path.extname(filePath).toLowerCase();

    const mimeType =
      extension === ".jpg" || extension === ".jpeg"
        ? "image/jpeg"
        : extension === ".webp"
        ? "image/webp"
        : extension === ".svg"
        ? "image/svg+xml"
        : "image/png";

    return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Failed to load organization logo:", error);
    return null;
  }
}
export async function generateProposalPdf(
  organizationId: string,
  proposalId: string,
  template: ProposalTemplate = "modern"
): Promise<Buffer> {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },

  include: {
    organization: {
      select: {
        id: true,
        name: true,
        logoUrl: true,
        email: true,
        phone: true,
        website: true,

        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,

        primaryColor: true,
        secondaryColor: true,
      },
    },

    client: {
      include: {
        contacts: true,
      },
    },

    sections: {
      orderBy: {
        sortOrder: "asc",
      },
    },

    items: {
      orderBy: {
        sortOrder: "asc",
      },
    },
  },
});

  if (!proposal) {
    throw new Error("Proposal not found");
  }

const formatMoney = (value: unknown) => {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const templateData: ProposalTemplateData  = {
  organizationName: proposal.organization.name,

  organization: {
    name: proposal.organization.name,
logoUrl: await getLogoDataUri(
  proposal.organization.logoUrl
),
    email: proposal.organization.email,
    phone: proposal.organization.phone,
    website: proposal.organization.website,

    addressLine1: proposal.organization.addressLine1,
    addressLine2: proposal.organization.addressLine2,
    city: proposal.organization.city,
    state: proposal.organization.state,
    postalCode: proposal.organization.postalCode,
    country: proposal.organization.country,

    primaryColor:
      proposal.organization.primaryColor,

    secondaryColor:
      proposal.organization.secondaryColor,
  },
  

  proposalNumber: proposal.proposalNumber,

  title: proposal.title,

  description: proposal.description,

  status: proposal.status,

  validUntil: proposal.validUntil
    ? proposal.validUntil.toLocaleDateString("en-IN")
    : null,

  client: {
    companyName: proposal.client.companyName,
    displayName: proposal.client.displayName,
    email: proposal.client.email,
    phone: proposal.client.phone,
    addressLine1: proposal.client.addressLine1,
    addressLine2: proposal.client.addressLine2,
    city: proposal.client.city,
    state: proposal.client.state,
    postalCode: proposal.client.postalCode,
    country: proposal.client.country,
  },

  sections: proposal.sections.map((section) => ({
    title: section.title,
    content: section.content,
  })),

  items: proposal.items.map((item) => ({
    name: item.name,
    description: item.description,
    quantity: formatMoney(item.quantity),
    unit: item.unit,
    unitPrice: formatMoney(item.unitPrice),
    total: formatMoney(item.total),
  })),

  subtotal: formatMoney(proposal.subtotal),
  discount: formatMoney(proposal.discount),
  tax: formatMoney(proposal.tax),
  total: formatMoney(proposal.total),
};

let html: string;

switch (template) {
  case "modern":
    html = renderModernProposal(templateData);
    break;

  case "corporate":
    html = renderCorporateProposal(templateData);
    break;

  case "minimal":
  html = renderMinimalProposal(templateData);
  break;
  default:
    throw new Error(`Unsupported proposal template: ${template}`);
}const browser = await puppeteer.launch({
  headless: true,
});

try {
const page = await browser.newPage();

await page.setContent(html, {
  waitUntil: "load",
});

// Wait for all images to finish loading
await page.evaluate(async () => {
  const images = Array.from(document.images);

  await Promise.all(
    images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve());
        img.addEventListener("error", () => resolve());
      });
    })
  );
});
const imageInfo = await page.evaluate(() =>
  Array.from(document.images).map((img) => ({
    src: img.src,
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  }))
);

console.log("PDF IMAGE INFO:", imageInfo);
const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  });

  return Buffer.from(pdf);
} finally {
  await browser.close();
}
}