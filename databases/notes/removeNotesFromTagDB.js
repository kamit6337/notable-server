import { Note } from "../../models/NoteModel.js";
import { removeNoteFromTagIntoRedis } from "../../redis/notes/notesFromRedis.js";

const removeNotesFromTagDB = async (noteId, tagId) => {
  const updatedNote = await Note.findOneAndUpdate(
    {
      _id: noteId,
    },
    {
      $pull: { tags: tagId },
    }
  );

  await removeNoteFromTagIntoRedis(noteId, tagId);

  return updatedNote;
};

export default removeNotesFromTagDB;
