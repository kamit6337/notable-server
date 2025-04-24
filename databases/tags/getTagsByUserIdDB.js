import { Tag } from "../../models/TagModel.js";
import {
  getTagsByUserIDFromRedis,
  setTagsToUserInRedis,
} from "../../redis/tags/tagsFromRedis.js";

const getTagsByUserIdDB = async (userId) => {
  const get = await getTagsByUserIDFromRedis(userId);

  if (get) return get;

  const tags = await Tag.find({
    user: userId,
  })
    .lean()
    .select("-__v")
    .sort({
      createdAt: -1,
    });

  await setTagsToUserInRedis(userId, tags);

  return tags;
};

export default getTagsByUserIdDB;
