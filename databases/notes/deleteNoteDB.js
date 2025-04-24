import { Note } from "../../models/NoteModel.js";

const deleteNoteDB = async (userId, noteId) => {
  await Note.deleteOne({
    _id: noteId,
  });

  await deleteNoteFromRedis(userId, noteId);
};

export default deleteNoteDB;
