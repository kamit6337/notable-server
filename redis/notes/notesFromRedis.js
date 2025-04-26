import redisClient from "../redisClient.js";

export const getNotesByUserIdFromRedis = async (userId) => {
  const noteIds = await redisClient.zrevrange(`User-Notes:${userId}`, 0, -1);

  if (!noteIds || noteIds.length === 0) return null;

  const notes = await Promise.all(
    noteIds.map((noteId) => redisClient.get(`Note:${noteId}`))
  );

  if (!notes || notes.length === 0) return null;

  const isMissing = notes.some((note) => !note);

  if (isMissing) return null;

  return notes.map((note) => JSON.parse(note));
};

export const setNotesToUserInRedis = async (userId, notes) => {
  if (!notes || notes.length === 0) return;

  const multi = redisClient.multi();

  for (const note of notes) {
    multi.zadd(
      `User-Notes:${userId}`,
      new Date(note.createdAt).getTime(),
      note._id?.toString()
    );

    multi.set(`Note:${note._id?.toString()}`, JSON.stringify(note), "EX", 3600);
  }
  multi.expire(`User-Notes:${userId}`, 3600);

  await multi.exec();
};

export const setNewNoteIntoRedis = async (userId, note) => {
  if (!userId || !note) return;

  await redisClient.zadd(
    `User-Notes:${userId}`,
    new Date(note.createdAt).getTime(),
    note._id?.toString()
  );

  await redisClient.set(
    `Note:${note._id?.toString()}`,
    JSON.stringify(note),
    "EX",
    3600
  );

  await redisClient.expire(`User-Notes:${userId}`, 3600);
};

export const updateNoteIntoRedis = async (note) => {
  if (!note) return null;

  await redisClient.set(
    `Note:${note._id?.toString()}`,
    JSON.stringify(note),
    "EX",
    3600
  );
};

export const removeNoteFromTagIntoRedis = async (noteId, tagId) => {
  if (!noteId || !tagId) return null;

  const note = await redisClient.get(`Note:${noteId}`);

  if (!note) return null;

  const parseNote = JSON.parse(note);

  const modifyNoteTags = parseNote.tags.filter((tag) => tag !== tagId);

  const modifyNote = {
    ...parseNote,
    tags: modifyNoteTags,
  };

  await redisClient.set(
    `Note:${noteId}`,
    JSON.stringify(modifyNote),
    "EX",
    3600
  );
};

export const deleteNoteFromRedis = async (userId, noteId) => {
  if (!userId || !noteId) return null;

  await redisClient.zrem(`User-Notes:${userId}`, noteId);
  await redisClient.del(`Note:${noteId}`);
};

export const getNotesByTagIdFromRedis = async (tagId) => {
  if (!tagId) return null;

  const noteIds = await redisClient.get(`Tag-Notes:${tagId}`);

  if (!noteIds || noteIds.length === 0) return null;

  const parseNoteIds = JSON.parse(noteIds);

  const notes = await Promise.all(
    parseNoteIds.map((noteId) => redisClient.get(`Note:${noteId}`))
  );

  if (!notes || notes.length === 0) return null;

  const isMissing = notes.some((note) => !note);
  if (isMissing) return null;

  return notes.map((note) => JSON.parse(note));
};

export const setNotesByTagIdIntoRedis = async (tagId, notes) => {
  if (!tagId || !notes || notes.length === 0) return null;

  const noteIds = notes.map((note) => note._id);

  await redisClient.set(
    `Tag-Notes:${tagId}`,
    JSON.stringify(noteIds),
    "EX",
    3600
  );

  const multi = redisClient.multi();

  for (const note of notes) {
    multi.set(`Note:${note._id}`, JSON.stringify(note), "EX", 3600);
  }

  await multi.exec();
};

export const getNotesByNotebookIdFromRedis = async (notebookId) => {
  if (!notebookId) return null;

  const noteIds = await redisClient.get(`Notebook-Notes:${notebookId}`);

  if (!noteIds || noteIds.length === 0) return null;

  const parseNoteIds = JSON.parse(noteIds);

  const notes = await Promise.all(
    parseNoteIds.map((noteId) => redisClient.get(`Note:${noteId}`))
  );

  if (!notes || notes.length === 0) return null;

  const isMissing = notes.some((note) => !note);
  if (isMissing) return null;

  return notes.map((note) => JSON.parse(note));
};

export const setNotesBynotebookIdIntoRedis = async (notebookId, notes) => {
  if (!notebookId || !notes || notes.length === 0) return null;

  const noteIds = notes.map((note) => note._id);

  await redisClient.set(
    `Notebook-Notes:${notebookId}`,
    JSON.stringify(noteIds),
    "EX",
    3600
  );

  const multi = redisClient.multi();

  for (const note of notes) {
    multi.set(`Note:${note._id}`, JSON.stringify(note), "EX", 3600);
  }

  await multi.exec();
};
