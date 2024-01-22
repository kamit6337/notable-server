import catchAsyncError from "../../utils/catchAsyncError.js";
import { Note } from "../../models/NoteModel.js";
import { Tag } from "../../models/TagModel.js";
import { changeUnderScoreId } from "../../utils/javaScript/basicJS.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const TRUE = "true";

// NOTE: GET ALL TAGS
export const getTags = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const tags = await Tag.find({
    userId,
  })
    .lean()
    .select("-__v")
    .sort({
      updatedAt: -1,
    });

  const tagsWithId = changeUnderScoreId(tags);

  res.status(200).json({
    message: "All tags",
    data: tagsWithId,
  });
});

// NOTE: CREATE TAG
export const createTag = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, isAddedToNote, noteId } = req.body;

  if (!name)
    return next(new HandleGlobalError("Tag Name must be provided", 404));

  // WORK: TAG IS CREATED FROM NOTE AND ADDED TO NOTE AT THE SAME TIME
  if (isAddedToNote === TRUE && noteId) {
    const newTag = await Tag.create({
      userId,
      title: name,
      noteList: [noteId],
    });

    await Note.updateOne(
      {
        _id: noteId,
      },
      {
        $push: { tagList: newTag._id },
      }
    );

    const tagWithId = changeUnderScoreId(newTag);

    res.status(200).json({
      message: "Tag is created and Added to Note",
      data: tagWithId,
    });
    return;
  }

  // WORK: TAG IS CREATED FROM TAG
  const newTag = await Tag.create({
    userId,
    title: name,
  });

  const tagWithId = changeUnderScoreId(newTag);

  res.status(200).json({
    message: "tag is created",
    data: tagWithId,
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
  const userId = req.userId;

  const { id } = req.query;

  if (!id) return next(new HandleGlobalError("Tag Name must be provided", 404));

  const promises = [
    // WORK: DELETE TAG FROM TAG
    Tag.deleteOne({
      _id: id,
    }),
    // WORK: DELETE TAG FROM NOTES
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
    message: "Tag is deleted",
  });
});
