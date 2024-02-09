import catchAsyncError from "../../utils/catchAsyncError.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { Notebook } from "../../models/NotebookModel.js";

const TRUE = "true";

// NOTE: GET NOTES
export const getNotes = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const notes = await Note.find({
    user,
  })
    .lean()
    .select("-__v")
    .sort({
      updatedAt: -1,
    });

  res.status(200).json({
    message: "Notes",
    data: notes,
  });
});

// NOTE: CREATE NOTES
export const createNote = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const { id } = req.body; //THIS IS NOTEBOOK ID and NOTEBOOK NAME IN WHICH NOTE IS CREATED

  if (!id)
    return next(
      new HandleGlobalError("Notebook ID and Name must be provided, 403")
    );

  const note = await Note.create({
    user,
    notebook: id,
  });

  res.status(200).json({
    message: "New Note created",
    data: note,
  });
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
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...obj,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Changed Note Title",
      data: updatedNote,
    });
    return;
  }

  // WORK: ADD TAG TO NOTE
  if (isTagAdd && tagId) {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      {
        $push: { tags: tagId },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Tag added to Note",
      data: updatedNote,
    });
    return;
  }

  // WORK: REMOVE TAG FROM NOTE
  if (isTagRemove && tagId) {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      {
        $pull: { tags: tagId },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Tag removed from Note",
      data: updatedNote,
    });
    return;
  }
});

// NOTE: DELETE NOTES
export const deleteNote = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id)
    return next(new HandleGlobalError("Note Name must be provided", 404));

  // WORK: DELETE NOTE FROM NOTE
  await Note.deleteOne({
    _id: id,
  });

  res.status(200).json({
    message: "Note is deleted",
  });
});
