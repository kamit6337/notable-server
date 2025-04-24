import { Notebook } from "../../models/NotebookModel.js";
import { deleteNotebookFromRedis } from "../../redis/notebooks/notebooksFromRedis.js";

const deleteNotebookDB = async (userId, notebookId) => {
  await Notebook.deleteOne({
    _id: notebookId,
  });

  await deleteNotebookFromRedis(userId, notebookId);
};

export default deleteNotebookDB;
