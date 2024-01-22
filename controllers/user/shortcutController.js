import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const TRUE = "true";

// NOTE: GET ALL NOTES AND NOTEBOOKS IN SHORTCUT
export const getShortcuts = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  // WORK: NOTEBOOKS WHICH IS SHORTCUTTED
  const notebooks = await Notebook.find({
    userId,
    shortcut: true,
  })
    .lean()
    .select("-__v")
    .sort({ updatedAt: -1 });

  let notebookNotes;
  if (notebooks && notebooks?.length > 0) {
    const notebooksWithId = changeUnderScoreId(notebooks);

    const promises = notebooksWithId.map(async (notebook) => {
      const notes = await Note.find({
        userId,
        notebookId: notebook._id,
      })
        .lean()
        .select("-__v")
        .sort({ updatedAt: -1 });

      const notesWithId = changeUnderScoreId(notes);

      notebook.noteList = notesWithId;

      return notebook;
    });

    notebookNotes = await Promise.all(promises);
  }

  // WORK: NOTES WHICH IS SHORTCUTTED
  const notes = await Note.find({
    userId,
    shortcut: true,
  })
    .lean()
    .select("-__v")
    .sort({ updatedAt: -1 });

  const notesWithId = changeUnderScoreId(notes);

  res.status(200).json({
    message: "All notes and notebooks of shortcut",
    notebooks: notebookNotes,
    notes: notesWithId,
  });
});

// NOTE: MAKE NOTE AND NOTEBOOK SHORTCUT
export const createShortcut = catchAsyncError(async (req, res, next) => {
  const { toNotebook, id, toNote } = req.body;

  // WORK: CREATE SHORTCUT TO NOTEBOOK
  if (toNotebook === TRUE && id) {
    await Notebook.findOneAndUpdate(
      {
        _id: id,
      },
      {
        shortcut: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is Added",
    });
    return;
  }

  // WORK: CREATE SHORTCUT TO NOTE
  if (toNote === TRUE && id) {
    await Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        shortcut: true,
      }
    );

    res.status(200).json({
      message: "Shortcut is added",
    });
    return;
  }
});

// NOTE: REMOVED NOTES AND NOTEBOOKS FROM SHORTCUT
export const updateShortcut = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { fromNotebook = false, id, fromNote = false } = req.body;

  // WORK: REMOVE NOTEBOOK FROM SHORTCUT
  if (fromNotebook && id) {
    await Notebook.findOneAndUpdate(
      {
        _id: id,
      },
      {
        shortcut: false,
      }
    );

    res.status(200).json({
      message: "Shortcut is Removed",
    });
    return;
  }

  // WORK: REMOVE NOTE FROM SHORTCUT
  if (fromNote && id) {
    await Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        shortcut: false,
      }
    );

    res.status(200).json({
      message: "Shortcut is Removed",
    });
    return;
  }
});
