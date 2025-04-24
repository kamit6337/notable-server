import { Tag } from "../../models/TagModel.js";
import { deleteTagFromRedis } from "../../redis/tags/tagsFromRedis.js";

const deleteTagDB = async (userId, tagId) => {
  const deleted = await Tag.deleteOne({
    _id: tagId,
  });

  await deleteTagFromRedis(userId, tagId);

  return deleted;
};

export default deleteTagDB;
