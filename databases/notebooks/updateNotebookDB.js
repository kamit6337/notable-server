import { Notebook } from "../../models/NotebookModel.js";
import { updateNotebookIntoRedis } from "../../redis/notebooks/notebooksFromRedis.js";

const updateNotebookDB = async (notebookId, obj) => {
  const updatedNotebook = await Notebook.findOneAndUpdate(
    { _id: notebookId },
    { ...obj },
    {
      new: true,
    }
  );

  await updateNotebookIntoRedis(updatedNotebook);

  return updatedNotebook;
};

export default updateNotebookDB;
