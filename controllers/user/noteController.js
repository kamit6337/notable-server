import catchAsyncError from "../../utils/catchAsyncError.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { Notebook } from "../../models/NotebookModel.js";

const TRUE = "true";

// NOTE: GET NOTES
export const getNotes = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const notes = await Note.find({
    userId,
  })
    .lean()
    .select("-__v")
    .sort({
      updatedAt: -1,
    });

  const notesWithId = changeUnderScoreId(notes);

  res.status(200).json({
    message: "Notes",
    data: notesWithId,
  });
});

// NOTE: CREATE NOTES
export const createNote = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id, name } = req.body; //THIS IS NOTEBOOK ID and NOTEBOOK NAME IN WHICH NOTE IS CREATED

  if (!id || !name)
    return next(
      new HandleGlobalError("Notebook ID and Name must be provided, 403")
    );

  const note = await Note.create({
    userId,
    notebookId: id,
    notebookTitle: name,
  });

  const noteWithId = changeUnderScoreId(note);

  res.status(200).json({
    message: "New Note created",
    data: noteWithId,
  });
});

// NOTE: UPDATE NOTES
export const updateNote = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id, name, content, isTagAdd, isTagRemove, tagId } = req.body;

  if (!id)
    return next(new HandleGlobalError("Note Name must be provided", 404));

  // WORK: UPDATE NOTE TITLE IN NOTE AND TAGS
  if (name) {
    await Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title: name,
      }
    );

    res.status(200).json({
      message: "Changed Note Title",
    });
    return;
  }

  // WORK: UPDATE THE NOTE CONTENT
  if (content) {
    await Note.findOneAndUpdate(
      {
        _id: id,
      },
      {
        content: content,
      }
    );

    res.status(200).json({
      message: "Content is Saved",
    });
    return;
  }

  // WORK: ADD TAG TO NOTE
  if (isTagAdd === TRUE && tagId) {
    const promises = [
      Note.findOneAndUpdate(
        { _id: id },
        {
          $push: { tagList: tagId },
        }
      ),
      Tag.findOneAndUpdate(
        {
          _id: tagId,
        },
        {
          $push: { noteList: id },
        }
      ),
    ];

    await Promise.all(promises);

    res.status(200).json({
      message: "Tag added to Note",
    });
    return;
  }

  // WORK: REMOVE TAG FROM NOTE
  if (isTagRemove === TRUE && tagId) {
    const promises = [
      Note.findOneAndUpdate(
        { _id: id },
        {
          $pull: { tagList: tagId },
        }
      ),
      Tag.findOneAndUpdate(
        {
          _id: tagId,
        },
        {
          $pull: { noteList: id },
        }
      ),
    ];

    await Promise.all(promises);

    res.status(200).json({
      message: "Tag removed from Note",
    });
    return;
  }
});

// NOTE: DELETE NOTES
export const deleteNote = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id)
    return next(new HandleGlobalError("Note Name must be provided", 404));

  const promises = [
    // WORK: DELETE NOTE FROM NOTE
    Note.deleteOne({
      _id: id,
    }),

    // WORK: DELETE ALL NOTE PRESENT IN TAG
    Tag.updateMany(
      {
        userId,
        noteList: { $elemMatch: id },
      },
      {
        $pull: { noteList: id },
      }
    ),
  ];

  await Promise.all(promises);

  res.status(200).json({
    message: "Note is deleted",
  });
});
