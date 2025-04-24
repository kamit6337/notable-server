import { Tag } from "../../models/TagModel.js";
import { setNewTagIntoRedis } from "../../redis/tags/tagsFromRedis.js";

const createTagDB = async (userId, obj) => {
  const newTag = Tag.create({
    ...obj,
  });

  await setNewTagIntoRedis(userId, obj);

  return newTag;
};

export default createTagDB;
