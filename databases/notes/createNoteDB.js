import { Note } from "../../models/NoteModel.js";
import { setNewNoteIntoRedis } from "../../redis/notes/notesFromRedis.js";

const createNoteDB = async (userId, obj) => {
  const note = await Note.create(obj);

  console.log("note is created", note);

  await setNewNoteIntoRedis(userId, note);

  console.log("note is send");

  return note;
};

export default createNoteDB;
