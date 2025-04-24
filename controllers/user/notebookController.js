import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import getNotebooksByUserID from "../../databases/notebooks/getNotebooksByUserID.js";
import createNewNotebook from "../../databases/notebooks/createNewNotebook.js";
import updateNotebookDB from "../../databases/notebooks/updateNotebookDB.js";
import deleteNotebookDB from "../../databases/notebooks/deleteNotebookDB.js";
import deleteNoteDB from "../../databases/notes/deleteNoteDB.js";
import getNotesFromNotebookIdDB from "../../databases/notes/getNotesFromNotebookIdDB.js";

// NOTE: GET NOTEBOOK
export const getNotebooks = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const notebooks = await getNotebooksByUserID(userId);

  res.status(200).json(notebooks);
});

// NOTE: CREATE NOTEBOOK
export const createNotebook = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name } = req.body;

  if (!name)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  const newNotebook = await createNewNotebook(userId, name);

  res.status(200).json(newNotebook);
});

// NOTE: UPDATE NOTEBOOK
export const updateNotebook = catchAsyncError(async (req, res, next) => {
  const { id, name } = req.body;

  if (!id)
    return next(new HandleGlobalError("Notebook ID must be provided, 403"));

  // WORK: Notebook name to change

  const obj = { title: name };

  const updatedNotebook = await updateNotebookDB(id, obj);

  res.status(200).json(updatedNotebook);
});

// NOTE: DELETE NOTEBOOK
export const deleteNotebook = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;
  if (!id)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  // WORK: DELETE NOTEBOOK FROM NOTEBOOK
  await deleteNotebookDB(userId, id);

  // WORK: DELETE NOTES RELATED TO THAT NOTEBOOK
  const notes = await getNotesFromNotebookIdDB(userId, id);
  await Promise.all(notes.map((note) => deleteNoteDB(note._id)));

  res.status(200).json("Notebook is Deleted with its notes");
});
