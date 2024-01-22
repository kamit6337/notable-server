export const changeUnderScoreId = (array, changeIdName = "id") => {
  if (!array) {
    return null;
  }

  if (!Array.isArray(array)) {
    const { _id, ...rest } = array; // Destructure _id and collect the rest of the properties
    return {
      [changeIdName]: _id,
      ...rest, // Include the rest of the properties
    };
  }

  if (array.length === 0) {
    return array;
  }

  const updatedArray = array?.map((obj) => {
    const { _id, ...rest } = obj; // Destructure _id and collect the rest of the properties
    return {
      [changeIdName]: _id,
      ...rest, // Include the rest of the properties
    };
  });
  return updatedArray;
};
