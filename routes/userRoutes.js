import express from "express";
import {
  createNotebook,
  deleteNotebook,
  getNotebooks,
  updateNotebook,
} from "../controllers/user/notebookController.js";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/user/noteController.js";
import {
  createTag,
  deleteTag,
  getTags,
  updateTag,
} from "../controllers/user/tagController.js";

import { changeDefaultNotebook } from "../controllers/user/otherRelatedController.js";

import {
  createShortcut,
  updateShortcut,
} from "../controllers/user/shortcutController.js";

const router = express.Router();

// NOTE: All REQUEST RELATED TO NOTEBOOK
router
  .route("/notebooks")
  .get(getNotebooks)
  .post(createNotebook)
  .patch(updateNotebook)
  .delete(deleteNotebook);

// NOTE: All REQUEST RELATED TO NOTE
router
  .route("/notes")
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

// // NOTE: All REQUEST RELATED TO TAG
router
  .route("/tags")
  .get(getTags)
  .post(createTag)
  .patch(updateTag)
  .delete(deleteTag);

// // NOTE: All REQUEST RELATED TO SHORTCUT
router.route("/shortcut").post(createShortcut).patch(updateShortcut);

// NOTE: All OTHER REQUEST
router.patch("/primary", changeDefaultNotebook);

export default router;
