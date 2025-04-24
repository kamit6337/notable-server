import { Note } from "../../models/NoteModel.js";
import { updateNoteIntoRedis } from "../../redis/notes/notesFromRedis.js";

const updateNoteDB = async (noteId, obj) => {
  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await updateNoteIntoRedis(noteId);

  return updatedNote;
};

export default updateNoteDB;
