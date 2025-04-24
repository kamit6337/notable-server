import { Note } from "../../models/NoteModel.js";
import {
  getNotesByTagIdFromRedis,
  setNotesByTagIdIntoRedis,
} from "../../redis/notes/notesFromRedis.js";

const getNotesByTagIdDB = async (userId, tagId) => {
  const get = await getNotesByTagIdFromRedis(tagId);
  if (get) return get;

  const notesWithTagId = await Note.find({
    user: userId,
    tags: tagId,
  }).lean();

  await setNotesByTagIdIntoRedis(tagId, notesWithTagId);

  return notesWithTagId;
};

export default getNotesByTagIdDB;
