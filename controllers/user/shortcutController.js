import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import updateNotebookDB from "../../databases/notebooks/updateNotebookDB.js";
import updateNoteDB from "../../databases/notes/updateNoteDB.js";

// NOTE: MAKE NOTE AND NOTEBOOK SHORTCUT
export const createShortcut = catchAsyncError(async (req, res, next) => {
  const { notebookId, noteId } = req.body;

  if (!notebookId && !noteId) {
    return next(
      new HandleGlobalError("either NotebookId or NoteId must be provided", 404)
    );
  }

  // WORK: CREATE SHORTCUT TO NOTEBOOK
  if (notebookId) {
    const obj = {
      shortcut: true,
    };

    const updateNotebook = await updateNotebookDB(notebookId, obj);

    res.status(200).json(updateNotebook);
    return;
  }

  // WORK: CREATE SHORTCUT TO NOTE
  if (noteId) {
    const obj = {
      shortcut: true,
    };

    const updateNote = await updateNoteDB(noteId, obj);

    res.status(200).json(updateNote);
    return;
  }
});

// NOTE: REMOVED NOTES AND NOTEBOOKS FROM SHORTCUT
export const updateShortcut = catchAsyncError(async (req, res, next) => {
  const { notebookId, noteId } = req.body;

  if (!notebookId && !noteId) {
    return next(
      new HandleGlobalError("either NotebookId or NoteId must be provided", 404)
    );
  }

  // WORK: REMOVED SHORTCUT TO NOTEBOOK
  if (notebookId) {
    const obj = {
      shortcut: false,
    };

    const updateNotebook = await updateNotebookDB(notebookId, obj);

    res.status(200).json(updateNotebook);
    return;
  }

  // WORK: REMOVED SHORTCUT TO NOTE
  if (noteId) {
    const obj = {
      shortcut: false,
    };

    const updateNote = await updateNoteDB(noteId, obj);

    res.status(200).json(updateNote);
    return;
  }
});
