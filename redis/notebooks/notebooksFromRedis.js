import redisClient from "../redisClient.js";

export const getNotebooksByUserIDFromRedis = async (userId) => {
  const notebookIds = await redisClient.zrevrange(
    `User-Notebooks:${userId}`,
    0,
    -1
  );

  if (!notebookIds || notebookIds.length === 0) return null;

  const notebooks = await Promise.all(
    notebookIds.map((notebookId) => redisClient.get(`Notebook:${notebookId}`))
  );

  if (!notebooks || notebooks.length === 0) return null;

  const isMissing = notebooks.some((notebook) => !notebook);

  if (isMissing) return null;

  return notebooks.map((notebook) => JSON.parse(notebook));
};

export const setNotebooksToUserInRedis = async (userId, notebooks) => {
  if (!notebooks || notebooks.length === 0) return;

  const multi = redisClient.multi();

  for (const notebook of notebooks) {
    multi.zadd(
      `User-Notebooks:${userId}`,
      notebook.createdAt,
      notebook._id?.toString()
    );

    multi.set(
      `Notebook:${notebook._id?.toString()}`,
      JSON.stringify(notebook),
      "EX",
      3600
    );
  }
  multi.expire(`User-Notebooks:${userId}`, 3600);

  await multi.exec();
};

export const setNewNotebookIntoRedis = async (userId, notebook) => {
  if (!userId || !notebook) return;

  await redisClient.zadd(
    `User-Notebooks:${userId}`,
    notebook.createdAt,
    notebook._id?.toString()
  );

  await redisClient.set(
    `Notebook:${notebook._id?.toString()}`,
    JSON.stringify(notebook),
    "EX",
    3600
  );

  await redisClient.expire(`User-Notebooks:${userId}`, 3600);
};

export const updateNotebookIntoRedis = async (notebook) => {
  if (!notebook) return null;

  await redisClient.set(
    `Notebook:${notebook._id?.toString()}`,
    JSON.stringify(notebook),
    "EX",
    3600
  );
};

export const deleteNotebookFromRedis = async (userId, notebookId) => {
  if (!userId || !notebookId) return null;

  await redisClient.zrem(`User-Notebooks:${userId}`, notebookId);
  await redisClient.del(`Notebook:${notebookId}`);
};
