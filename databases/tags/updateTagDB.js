import { Tag } from "../../models/TagModel.js";

const updateTagDB = async (tagId, obj) => {
  const updatedTag = await Tag.findOneAndUpdate(
    {
      _id: tagId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await updateTagIntoRedis(updatedTag);

  return updatedTag;
};

export default updateTagDB;
