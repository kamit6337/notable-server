import { Note } from "../../models/NoteModel.js";
import { setNewNoteIntoRedis } from "../../redis/notes/notesFromRedis.js";

const createNoteDB = async (userId, obj) => {
  const note = await Note.create(obj);

  await setNewNoteIntoRedis(userId, obj);

  return note;
};

export default createNoteDB;
