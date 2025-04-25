import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import createNoteDB from "../../databases/notes/createNoteDB.js";
import updateNoteDB from "../../databases/notes/updateNoteDB.js";
import deleteNoteDB from "../../databases/notes/deleteNoteDB.js";
import getNotesByUserIdDB from "../../databases/notes/getNotesByUserIdDB.js";

// NOTE: GET NOTES
export const getNotes = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const notes = await getNotesByUserIdDB(userId);

  res.status(200).json(notes);
});

// NOTE: CREATE NOTES
export const createNote = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id, tagId } = req.body; //THIS IS NOTEBOOK ID and NOTEBOOK NAME IN WHICH NOTE IS CREATED

  if (!id)
    return next(
      new HandleGlobalError("Notebook ID and Name must be provided, 403")
    );

  const obj = {
    user: userId,
    notebook: id,
  };

  if (tagId) {
    obj.tags = [tagId];
  }

  const note = await createNoteDB(userId, obj);

  res.status(200).json(note);
});

// NOTE: UPDATE NOTES
export const updateNote = catchAsyncError(async (req, res, next) => {
  const { id, title, body, isTagAdd, isTagRemove, tagId } = req.body;

  if (!id)
    return next(new HandleGlobalError("Note Name must be provided", 404));

  const obj = {};

  if (title) {
    obj.title = title;
  }

  if (body) {
    obj.body = body;
  }

  // WORK: UPDATE NOTE TITLE IN NOTE AND TAGS
  if (title) {
    const updatedNote = await updateNoteDB(id, obj);

    res.status(200).json(updatedNote);
    return;
  }

  // WORK: ADD TAG TO NOTE
  if (isTagAdd && tagId) {
    const obj = {
      $push: { tags: tagId },
    };

    const updatedNote = await updateNoteDB(id, obj);

    res.status(200).json(updatedNote);
    return;
  }

  // WORK: REMOVE TAG FROM NOTE
  if (isTagRemove && tagId) {
    const obj = {
      $pull: { tags: tagId },
    };

    const updatedNote = await updateNoteDB(id, obj);

    res.status(200).json(updatedNote);
    return;
  }
});

// NOTE: DELETE NOTES
export const deleteNote = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id)
    return next(new HandleGlobalError("Note Name must be provided", 404));

  // WORK: DELETE NOTE FROM NOTE
  await deleteNoteDB(userId, id);

  res.status(200).json("Note is deleted");
});
