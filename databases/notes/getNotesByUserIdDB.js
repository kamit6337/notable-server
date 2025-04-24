import { Note } from "../../models/NoteModel.js";
import {
  getNotesByUserIdFromRedis,
  setNotesToUserInRedis,
} from "../../redis/notes/notesFromRedis.js";

const getNotesByUserIdDB = async (userId) => {
  const get = await getNotesByUserIdFromRedis(userId);

  if (get) return get;

  const notes = await Note.find({
    user: userId,
  })
    .sort("-createdAt")
    .lean();

  await setNotesToUserInRedis(userId, notes);

  return notes;
};

export default getNotesByUserIdDB;
