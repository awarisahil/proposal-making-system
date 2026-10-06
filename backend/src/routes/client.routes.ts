import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  createClientController,
  getClientsController,
  getClientController,
  updateClientController,
  deleteClientController,
  createClientContactController,
  getClientContactsController,
  updateClientContactController,
  deleteClientContactController,
} from "../controllers/client.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", createClientController);

router.get("/", getClientsController);

router.get("/:id", getClientController);

router.put("/:id", updateClientController);

router.delete("/:id", deleteClientController);

router.post(
  "/:id/contacts",
  createClientContactController
);

router.get(
  "/:id/contacts",
  getClientContactsController
);

router.put(
  "/:id/contacts/:contactId",
  updateClientContactController
);

router.delete(
  "/:id/contacts/:contactId",
  deleteClientContactController
);

export default router;