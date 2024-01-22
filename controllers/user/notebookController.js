import catchAsyncError from "../../utils/catchAsyncError.js";
import { Notebook } from "../../models/NotebookModel.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const TRUE = "true";

// NOTE: GET NOTEBOOK
export const getNotebooks = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const notebooks = await Notebook.find({ userId })
    .select("-__v")
    .lean()
    .sort({ updatedAt: -1 });

  const notebooksId = changeUnderScoreId(notebooks);

  res.status(200).json({
    message: "All Notebook",
    data: notebooksId,
  });
});

// NOTE: CREATE NOTEBOOK
export const createNotebook = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name } = req.body;

  if (!name)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  const newNotebook = await Notebook.create({
    userId,
    title: name,
  });

  const notebooksId = changeUnderScoreId(newNotebook);

  res.status(200).json({
    message: "New Notebook created",
    data: notebooksId,
  });
});

// NOTE: UPDATE NOTEBOOK
export const updateNotebook = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id, name, isStackRemove, isNewStack, stackId, stackName } = req.body;

  if (!id)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  // WORK: Notebook name to change
  if (name) {
    const promises = [
      Notebook.findOneAndUpdate(
        { _id: id },
        { title: name, updatedAt: Date.now() }
      ),
      Note.updateMany({ userId, notebookId: id }, { notebookTitle: name }),
    ];
    await Promise.all(promises);

    await res.status(200).json({
      message: "Changed Notebook Title",
    });
    return;
  }

  // WORK: Notebook need to come out of that stack

  if (isStackRemove === TRUE) {
    await Notebook.findOneAndUpdate(
      { _id: id },
      { stackTitle: null, stackId: null }
    );
    res.status(200).json({
      message: "Notebook removed from Stack",
    });
    return;
  }

  if (isNewStack === TRUE && stackName) {
    await Notebook.findOneAndUpdate({ _id: id }, { stackTitle: stackName });
    res.status(200).json({
      message: "New Stack created and added Notebook to it",
    });
    return;
  }

  if (stackId && stackName) {
    await Notebook.findOneAndUpdate(
      { _id: id },
      { stackTitle: stackName, stackId }
    );
    res.status(200).json({
      message: "Notebook Added to Stack",
    });
    return;
  }
});

// NOTE: DELETE NOTEBOOK
export const deleteNotebook = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;
  if (!id)
    return next(new HandleGlobalError("Notebook Name must be provided, 403"));

  const promises = [
    //   WORK: FIND NOTES RELATED TO NOTEBOOK
    Note.find({
      userId,
      notebookId: id,
    }),
    // WORK: DELETE NOTEBOOK FROM NOTEBOOK
    Notebook.deleteOne({
      _id: id,
    }),
  ];

  const [notes] = await Promise.all(promises);

  //   WORK: DELETE ALL NOTES PRESENT IN THAT NOTEBOOK FROM TAG
  const new_promises = notes?.map(async (note) => {
    await Tag.updateMany(
      {
        userId,
        noteList: { $elemMatch: note._id },
      },
      {
        $pull: { noteList: note._id },
      }
    );
    return;
  });

  await Promise.all(new_promises);

  // WORK: DELETE THE NOTES RELATED TO THAT NOTEBOOK
  await Note.deleteMany({ userId, notebookId: id });

  res.status(200).json({
    message: "Notebook is Deleted",
  });
});
