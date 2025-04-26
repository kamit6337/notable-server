import { Notebook } from "../../models/NotebookModel.js";
import { setNewNotebookIntoRedis } from "../../redis/notebooks/notebooksFromRedis.js";

const createNewNotebook = async (userId, name) => {
  const checkAlreadyExistWithName = await Notebook.exists({
    user: userId,
    title: name,
  });

  if (!!checkAlreadyExistWithName) {
    throw new Error("Notebook name must be unique. Try different name");
  }

  const newNotebook = await Notebook.create({
    user: userId,
    title: name,
  });

  await setNewNotebookIntoRedis(userId, newNotebook);

  return newNotebook;
};

export default createNewNotebook;
