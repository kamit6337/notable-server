import { Notebook } from "../../models/NotebookModel.js";
import {
  getNotebooksByUserIDFromRedis,
  setNotebooksToUserInRedis,
} from "../../redis/notebooks/notebooksFromRedis.js";

const getNotebooksByUserID = async (userId) => {
  const get = await getNotebooksByUserIDFromRedis(userId);

  if (get) {
    return get;
  }

  const notebooks = await Notebook.find({ user: userId })
    .sort("-createdAt")
    .lean();

  await setNotebooksToUserInRedis(userId, notebooks);

  return notebooks;
};

export default getNotebooksByUserID;
