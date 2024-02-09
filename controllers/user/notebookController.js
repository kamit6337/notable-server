import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const TRUE = "true";

// NOTE: GET NOTEBOOK
export const getNotebooks = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const notebooks = await Notebook.find({ user })
    .select("-__v")
    .lean()
    .sort({ updatedAt: -1 });

  res.status(200).json({
    message: "All Notebook",
    data: notebooks,
  });
});

// NOTE: CREATE NOTEBOOK
export const createNotebook = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const { name } = req.body;

  if (!name)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  const newNotebook = await Notebook.create({
    user,
    title: name,
  });

  res.status(200).json({
    message: "New Notebook created",
    data: newNotebook,
  });
});

// NOTE: UPDATE NOTEBOOK
export const updateNotebook = catchAsyncError(async (req, res, next) => {
  const { id, name } = req.body;

  if (!id)
    return next(new HandleGlobalError("Notebook ID must be provided, 403"));

  // WORK: Notebook name to change
  const updatedNotebook = await Notebook.findOneAndUpdate(
    { _id: id },
    { title: name, updatedAt: Date.now() },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Changed Notebook Title",
    data: updatedNotebook,
  });
  return;
});

// NOTE: DELETE NOTEBOOK
export const deleteNotebook = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  if (!id)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  // WORK: DELETE NOTEBOOK FROM NOTEBOOK
  await Notebook.deleteOne({
    _id: id,
  }),
    // WORK: DELETE NOTES RELATED TO THAT NOTEBOOK
    await Note.deleteMany({
      notebook: id,
    }),
    res.status(200).json({
      message: "Notebook is Deleted with its notes",
    });
});
