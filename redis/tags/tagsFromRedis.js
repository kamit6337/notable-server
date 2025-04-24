import redisClient from "../redisClient.js";

export const getTagsByUserIDFromRedis = async (userId) => {
  const tagIds = await redisClient.zrevrange(`User-Tags:${userId}`, 0, -1);

  if (!tagIds || tagIds.length === 0) return null;

  const tags = await Promise.all(
    tagIds.map((tagId) => redisClient.get(`Tag:${tagId}`))
  );

  if (!tags || tags.length === 0) return null;

  const isMissing = tags.some((tag) => !tag);

  if (isMissing) return null;

  return tags.map((tag) => JSON.parse(tag));
};

export const setTagsToUserInRedis = async (userId, tags) => {
  if (!tags || tags.length === 0) return;

  const multi = redisClient.multi();

  for (const tag of tags) {
    multi.zadd(`User-Tags:${userId}`, tag.createdAt, tag._id?.toString());

    multi.set(`Tag:${tag._id?.toString()}`, JSON.stringify(tag), "EX", 3600);
  }
  multi.expire(`User-Tags:${userId}`, 3600);

  await multi.exec();
};

export const setNewTagIntoRedis = async (userId, tag) => {
  if (!userId || !tag) return;

  await redisClient.zadd(
    `User-Tags:${userId}`,
    tag.createdAt,
    tag._id?.toString()
  );

  await redisClient.set(
    `Tag:${tag._id?.toString()}`,
    JSON.stringify(tag),
    "EX",
    3600
  );

  await redisClient.expire(`User-Tags:${userId}`, 3600);
};

export const updateTagIntoRedis = async (tag) => {
  if (!tag) return null;

  await redisClient.set(
    `Tag:${tag._id?.toString()}`,
    JSON.stringify(tag),
    "EX",
    3600
  );
};

export const deleteTagFromRedis = async (userId, tagId) => {
  if (!userId || !tagId) return null;

  await redisClient.zrem(`User-Tags:${userId}`, tagId);
  await redisClient.del(`Tag:${tagId}`);
};
