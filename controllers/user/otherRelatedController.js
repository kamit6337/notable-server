import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

// NOTE: GET ALL NOTES RELATED TO THAT NOTEBOOK
export const getNotebookNotes = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query; //THIS IS NOTEBOOK ID TO GET ALL ITS NOTES

  if (!id)
    return next(new HandleGlobalError("Notebook ID must be provided, 403"));

  const notes = await Note.find({
    notebookId: id,
  })
    .lean()
    .select("-__v")
    .sort({ updatedAt: -1 });

  const notesWithId = changeUnderScoreId(notes);

  res.status(200).json({
    message: `Notes related to Notebook`,
    data: notesWithId,
  });
});

// NOTE: GET ALL NOTES RELATED TO THAT TAG
export const getTagNotes = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query; //THIS IS TAG ID AND ALL NOTES RELATED TO THIS TAG WILL BE RETURNED

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  const notes = await Note.find({
    userId,
    tagList: { $in: [id] },
  })
    .lean()
    .select("-__v")
    .sort({
      updatedAt: -1,
    });

  const notesWithId = changeUnderScoreId(notes);

  res.status(200).json({
    message: "Notes related to Tag",
    data: notesWithId,
  });
});

// NOTE: CHANGE PRIMARY NOTEBOOK
export const changeDefaultNotebook = catchAsyncError(async (req, res, next) => {
  const { id, changedId } = req.body; // ID WILL BE OF PRIMARY NOTEBOOK AND CHANGEID IS OF CHANGED PRIMARY

  // WORK: CHANGE PRIMARY NOTEBOOK
  if (id === changedId) {
    return;
  } else if (id && changedId) {
    const promises = [
      Notebook.findOneAndUpdate(
        {
          _id: id,
        },
        {
          primary: false,
          updatedAt: Date.now(),
        }
      ),
      Notebook.findOneAndUpdate(
        {
          _id: changedId,
        },
        {
          primary: true,
          updatedAt: Date.now(),
        }
      ),
    ];

    await Promise.all(promises);

    res.status(200).json({
      message: "Primary Notebook is changed",
    });
    return;
  }
});
