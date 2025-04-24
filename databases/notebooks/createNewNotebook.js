import { Notebook } from "../../models/NotebookModel.js";
import { setNewNotebookIntoRedis } from "../../redis/notebooks/notebooksFromRedis.js";

const createNewNotebook = async (userId, name) => {
  const newNotebook = await Notebook.create({
    user: userId,
    title: name,
  });

  await setNewNotebookIntoRedis(userId, newNotebook);

  return newNotebook;
};

export default createNewNotebook;
