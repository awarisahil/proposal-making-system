import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  createClientContact,
  getClientContacts,
  updateClientContact,
  deleteClientContact,
} from "../services/client.service.js";

import {
  createClientSchema,
  updateClientSchema,
  createClientContactSchema,
  updateClientContactSchema,
} from "../validators/client.validator.js";
function getParam(
  value: string | string[] | undefined,
  name: string
): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is required`);
  }

  return value;
}
export async function createClientController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = createClientSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const client = await createClient(
      req.user.organizationId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    console.error("Create client error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create client",
    });
  }
}

export async function getClientsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const clients = await getClients(
      req.user.organizationId
    );

    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch clients",
    });
  }
}

export async function getClientController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const client = await getClientById(
      req.user.organizationId,
      getParam(req.params.id, "Client ID")
    );

    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Get client error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch client",
    });
  }
}

export async function updateClientController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = updateClientSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const client = await updateClient(
      req.user.organizationId,
      getParam(req.params.id, "Client ID"),
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    console.error("Update client error:", error);

    if (
      error instanceof Error &&
      error.message === "Client not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update client",
    });
  }
}

export async function deleteClientController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    await deleteClient(
      req.user.organizationId,
      getParam(req.params.id, "Client ID")
    );

    res.status(200).json({
      success: true,
      message: "Client archived successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    if (
      error instanceof Error &&
      error.message === "Client not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to archive client",
    });
  }
}

export async function createClientContactController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = createClientContactSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const contact = await createClientContact(
      req.user.organizationId,
      getParam(req.params.id, "Client ID"),
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Client contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create client contact error:", error);

    if (
      error instanceof Error &&
      error.message === "Client not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to create client contact",
    });
  }
}

export async function getClientContactsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const contacts = await getClientContacts(
      req.user.organizationId,
      getParam(req.params.id, "Client ID")
    );

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Get client contacts error:", error);

    if (
      error instanceof Error &&
      error.message === "Client not found"
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to fetch client contacts",
    });
  }
}

export async function updateClientContactController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const validation = updateClientContactSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const contact = await updateClientContact(
      req.user.organizationId,
      getParam(req.params.id, "Client ID"),
      getParam(req.params.contactId, "Contact ID"),
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Client contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update client contact error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Client not found" ||
        error.message === "Contact not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to update client contact",
    });
  }
}

export async function deleteClientContactController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    await deleteClientContact(
      req.user.organizationId,
      getParam(req.params.id, "Client ID"),
      getParam(req.params.contactId, "Contact ID")
    );

    res.status(200).json({
      success: true,
      message: "Client contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete client contact error:", error);

    if (
      error instanceof Error &&
      (
        error.message === "Client not found" ||
        error.message === "Contact not found"
      )
    ) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Unable to delete client contact",
    });
  }
}