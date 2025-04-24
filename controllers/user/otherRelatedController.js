import catchAsyncError from "../../utils/catchAsyncError.js";
import updateNotebookDB from "../../databases/notebooks/updateNotebookDB.js";

// NOTE: CHANGE PRIMARY NOTEBOOK
export const changeDefaultNotebook = catchAsyncError(async (req, res, next) => {
  const { id, changedId } = req.body; // ID WILL BE OF PRIMARY NOTEBOOK AND CHANGEID IS OF CHANGED PRIMARY

  // WORK: CHANGE PRIMARY NOTEBOOK
  if (id === changedId) {
    return;
  } else if (id && changedId) {
    const obj1 = {
      primary: false,
    };

    const obj2 = {
      primary: true,
    };

    const promises = [
      updateNotebookDB(id, obj1),
      updateNotebookDB(changedId, obj2),
    ];

    await Promise.all(promises);

    res.status(200).json("Primary Notebook is changed");
  }
});
