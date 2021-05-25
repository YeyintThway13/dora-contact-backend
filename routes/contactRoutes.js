import express from "express";
import {
  deleteContact,
  getMineContacts,
  postAContact,
  updateContact,
} from "../controllers/contactController.js";
import auth from "../utilities/auth.js";

const router = express.Router();

router.post("/", auth, postAContact);

router.get("/", auth, getMineContacts);

router.delete("/:id", auth, deleteContact);

router.patch("/:id", auth, updateContact);

export default router;
