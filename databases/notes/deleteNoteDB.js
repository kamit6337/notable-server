import { Note } from "../../models/NoteModel.js";
import { deleteNoteFromRedis } from "../../redis/notes/notesFromRedis.js";

const deleteNoteDB = async (userId, noteId) => {
  await Note.deleteOne({
    _id: noteId,
  });

  await deleteNoteFromRedis(userId, noteId);
};

export default deleteNoteDB;
