const getCurrentTime = () => {
  // Get the current time in UTC using Date.now()
  const currentTimeUTC = Date.now();

  // Convert milliseconds to a Date object
  const dateUTC = new Date(currentTimeUTC);

  return dateUTC.getTime();
};

export default getCurrentTime;
