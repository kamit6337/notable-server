import catchAsyncError from "../../utils/catchAsyncError.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import getTagsByUserIdDB from "../../databases/tags/getTagsByUserIdDB.js";
import createTagDB from "../../databases/tags/createTagDB.js";
import updateNoteDB from "../../databases/notes/updateNoteDB.js";
import updateTagDB from "../../databases/tags/updateTagDB.js";
import removeNotesFromTagDB from "../../databases/notes/removeNotesFromTagDB.js";
import deleteTagDB from "../../databases/tags/deleteTagDB.js";

// NOTE: GET ALL TAGS
export const getTags = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const tags = await getTagsByUserIdDB(userId);

  res.status(200).json(tags);
});

// NOTE: CREATE TAG
export const createTag = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, isAddedToNote, noteId } = req.body;

  if (!name)
    return next(new HandleGlobalError("Tag Name must be provided", 404));

  const obj = {
    user: userId,
    title: name,
  };

  const newTag = await createTagDB(userId, obj);

  // WORK: TAG IS CREATED FROM NOTE AND ADDED TO NOTE AT THE SAME TIME
  if (isAddedToNote && noteId) {
    const obj = {
      $push: { tags: newTag._id },
    };

    const updatedNote = await updateNoteDB(noteId, obj);

    res.status(200).json({
      message: "Tag is created and Added to Note",
      tag: newTag,
      note: updatedNote,
    });
    return;
  }

  res.status(200).json(newTag);
});

// NOTE: UPDATE TAG
export const updateTag = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let { id, name, isNoteRemove, noteId } = req.body;

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  //   WORK: CHANGE TAG TITLE FROM TITLE AND NOTES
  if (name) {
    const obj = {
      title: name,
    };

    const updatedTag = await updateTagDB(id, obj);

    res.status(200).json(updatedTag);
    return;
  }

  // WORK: NOTES REMOVED FROM TAG
  if (isNoteRemove === TRUE && noteId) {
    await removeNotesFromTagDB(noteId, id);

    res.status(200).json("Notes removed");
  }
});

// NOTE: DELETE TAG

export const deleteTag = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  // WORK: DELETE TAG FROM TAG
  await deleteTagDB(userId, id);

  // WORK: DELETE TAG FROM NOTES

  const notesWithTagId = await getNotesByTagIdDB(userId, id);

  await Promise.all(
    notesWithTagId.map((note) => removeNotesFromTagDB(note._id?.toString(), id))
  );

  // const updatedNote = await Note.updateMany(
  //   {
  //     user,
  //     tags: id,
  //   },
  //   {
  //     $pull: { tags: id },
  //   }
  // );

  res.status(200).json("Tag deleted and Notes removed");
});
