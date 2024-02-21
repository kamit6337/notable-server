import catchAsyncError from "../../utils/catchAsyncError.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";


// NOTE: GET ALL TAGS
export const getTags = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const tags = await Tag.find({
    user,
  })
    .lean()
    .select("-__v")
    .sort({
      updatedAt: -1,
    });

  res.status(200).json({
    message: "All tags",
    data: tags,
  });
});

// NOTE: CREATE TAG
export const createTag = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const { name, isAddedToNote, noteId } = req.body;

  if (!name)
    return next(new HandleGlobalError("Tag Name must be provided", 404));

  // WORK: TAG IS CREATED FROM NOTE AND ADDED TO NOTE AT THE SAME TIME
  if (isAddedToNote && noteId) {
    const newTag = await Tag.create({
      user,
      title: name,
    });

    const updatedNote = await Note.updateOne(
      {
        _id: noteId,
      },
      {
        $push: { tags: newTag._id },
      }
    );

    res.status(200).json({
      message: "Tag is created and Added to Note",
      tag: newTag,
      note: updatedNote,
    });
    return;
  }

  // WORK: TAG IS CREATED FROM TAG
  const newTag = await Tag.create({
    user,
    title: name,
  });

  res.status(200).json({
    message: "tag is created",
    data: newTag,
  });
});

// NOTE: UPDATE TAG
export const updateTag = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  let { id, name, isNoteRemove, noteId } = req.body;

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  //   WORK: CHANGE TAG TITLE FROM TITLE AND NOTES
  if (name) {
    const updatedTag = await Tag.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title: name,
        updatedAt : Date.now()
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Tag Title Changed",
      data: updatedTag,
    });
    return;
  }

  // WORK: NOTES REMOVED FROM TAG

  if (isNoteRemove === TRUE && noteId) {
    const promises = [
      Tag.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: { noteList: noteId },
          updatedAt : Date.now()
        }
      ),
      Note.updateMany(
        {
          userId,
          tagList: { $elemMatch: id },
        },
        {
          $pull: { tagList: id },
        }
      ),
    ];

    await Promise.all(promises);

    res.status(200).json({
      message: "Notes removed",
    });

    return;
  }
});

// NOTE: DELETE TAG

export const deleteTag = catchAsyncError(async (req, res, next) => {
  const user = req.userId;

  const { id } = req.query;

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  // WORK: DELETE TAG FROM TAG
  const deletedTag = await Tag.deleteOne({
    _id: id,
  });

  // WORK: DELETE TAG FROM NOTES
  const updatedNote = await Note.updateMany(
    {
      user,
      tags: id,
    },
    {
      $pull: { tags: id },
    }
  );

  res.status(200).json({
    message: "Tag is deleted",
    data: updatedNote,
  });
});
