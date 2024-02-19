import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

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
    const updateNotebook = await Notebook.findOneAndUpdate(
      {
        _id: notebookId,
      },
      {
        shortcut: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is Added to notebook",
      data: updateNotebook,
    });

    return;
  }

  // WORK: CREATE SHORTCUT TO NOTE
  if (noteId) {
    const updateNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
      },
      {
        shortcut: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is added is Note",
      data: updateNote,
    });
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
    const updateNotebook = await Notebook.findOneAndUpdate(
      {
        _id: notebookId,
      },
      {
        shortcut: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is Removed to notebook",
      data: updateNotebook,
    });

    return;
  }

  // WORK: REMOVED SHORTCUT TO NOTE
  if (noteId) {
    const updateNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
      },
      {
        shortcut: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is removed is Note",
      data: updateNote,
    });
    return;
  }
});
