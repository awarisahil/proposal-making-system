import { prisma } from "../config/database.js";

import type {
  CreateClientInput,
  UpdateClientInput,
  CreateClientContactInput,
  UpdateClientContactInput,
} from "../validators/client.validator.js";

export async function createClient(
  organizationId: string,
  data: CreateClientInput
) {
  return prisma.client.create({
    data: {
      organizationId,

      companyName: data.companyName,
      displayName: data.displayName,
      email: data.email || null,
      phone: data.phone,
      website: data.website || null,

      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,

      notes: data.notes,

      status: data.status ?? "ACTIVE",
    },

    include: {
      contacts: true,
    },
  });
}

export async function getClients(
  organizationId: string
) {
  return prisma.client.findMany({
    where: {
      organizationId,
    },

    include: {
      contacts: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getClientById(
  organizationId: string,
  clientId: string
) {
  return prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },

    include: {
      contacts: true,
    },
  });
}

export async function updateClient(
  organizationId: string,
  clientId: string,
  data: UpdateClientInput
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  return prisma.client.update({
    where: {
      id: client.id,
    },

    data: {
      ...data,

      email:
        data.email === undefined
          ? undefined
          : data.email || null,

      website:
        data.website === undefined
          ? undefined
          : data.website || null,
    },

    include: {
      contacts: true,
    },
  });
}

export async function deleteClient(
  organizationId: string,
  clientId: string
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  await prisma.client.update({
    where: {
      id: client.id,
    },

    data: {
      status: "ARCHIVED",
    },
  });
}

export async function createClientContact(
  organizationId: string,
  clientId: string,
  data: CreateClientContactInput
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  if (data.isPrimary) {
    await prisma.clientContact.updateMany({
      where: {
        clientId,
      },

      data: {
        isPrimary: false,
      },
    });
  }

  return prisma.clientContact.create({
    data: {
      clientId,

      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone,
      designation: data.designation,
      isPrimary: data.isPrimary ?? false,
    },
  });
}

export async function getClientContacts(
  organizationId: string,
  clientId: string
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  return prisma.clientContact.findMany({
    where: {
      clientId,
    },

    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}

export async function updateClientContact(
  organizationId: string,
  clientId: string,
  contactId: string,
  data: UpdateClientContactInput
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const contact = await prisma.clientContact.findFirst({
    where: {
      id: contactId,
      clientId,
    },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  if (data.isPrimary) {
    await prisma.clientContact.updateMany({
      where: {
        clientId,
        id: {
          not: contactId,
        },
      },

      data: {
        isPrimary: false,
      },
    });
  }

  return prisma.clientContact.update({
    where: {
      id: contactId,
    },

    data: {
      ...data,

      email:
        data.email === undefined
          ? undefined
          : data.email || null,
    },
  });
}

export async function deleteClientContact(
  organizationId: string,
  clientId: string,
  contactId: string
) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      organizationId,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const contact = await prisma.clientContact.findFirst({
    where: {
      id: contactId,
      clientId,
    },
  });

  if (!contact) {
    throw new Error("Contact not found");
  }

  await prisma.clientContact.delete({
    where: {
      id: contactId,
    },
  });
}