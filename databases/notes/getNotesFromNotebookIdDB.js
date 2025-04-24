import { Note } from "../../models/NoteModel.js";
import {
  getNotesByNotebookIdFromRedis,
  setNotesBynotebookIdIntoRedis,
} from "../../redis/notes/notesFromRedis.js";

const getNotesFromNotebookIdDB = async (notebookId) => {
  const get = await getNotesByNotebookIdFromRedis(notebookId);

  if (get) return get;

  const notes = await Note.find({
    notebook: notebookId,
  }).lean();

  await setNotesBynotebookIdIntoRedis(notebookId, notes);

  return notes;
};

export default getNotesFromNotebookIdDB;
