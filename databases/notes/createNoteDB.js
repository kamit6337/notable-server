import { Note } from "../../models/NoteModel.js";
import { setNewNoteIntoRedis } from "../../redis/notes/notesFromRedis.js";

const createNoteDB = async (userId, obj) => {
  const findListOfUnitiledNoNotes = await Note.find({
    user: userId,
    title: new RegExp("Untitled", "i"),
  }).lean();

  let usedNumbers = new Set();

  if (findListOfUnitiledNoNotes?.length > 0) {
    findListOfUnitiledNoNotes.forEach((note) => {
      if (note.title === "Untitled") {
        usedNumbers.add(0);
      } else {
        const count = note.title.split("-")[1];
        usedNumbers.add(parseInt(count));
      }
    });
  }

  // Find the smallest available number
  let availableNumber = 0;
  while (usedNumbers.has(availableNumber)) {
    availableNumber++;
  }

  const title =
    availableNumber === 0 ? "Untitled" : `Untitled-${availableNumber}`;

  const note = await Note.create({
    ...obj,
    title,
  });

  await setNewNoteIntoRedis(userId, note);
  return note;
};

export default createNoteDB;
