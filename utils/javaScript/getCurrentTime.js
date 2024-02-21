const getCurrentTime = () => {
  // Get the current time in UTC using Date.now()
  const currentTimeUTC = Date.now();

  // Convert milliseconds to a Date object
  const dateUTC = new Date(currentTimeUTC);

  // Adjust the time zone offset for IST (UTC +5 hours and 30 minutes)
  const offsetIST = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
  const currentTimeIST = new Date(dateUTC.getTime() + offsetIST);

  return { inMilliSec: dateUTC.getTime(), inIST: currentTimeIST };
};

export default getCurrentTime;
