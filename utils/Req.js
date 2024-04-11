const Req = (req) => {
  const { cookie } = req.headers;

  if (!cookie) {
    throw new Error("Your do not have active session. Please Login");
  }

  let cookies = {};

  const cookieArray = cookie.split("; ");

  if (!cookieArray) {
    const equalSignIndex = cookie.indexOf("=");

    const key = cookie.slice(0, equalSignIndex);
    const value = cookie.slice(equalSignIndex + 1);

    cookies[key] = value;
  } else {
    cookieArray.forEach((cookie) => {
      const equalSignIndex = cookie.indexOf("=");

      if (equalSignIndex == -1) return cookie;

      const key = cookie.slice(0, equalSignIndex);
      const value = cookie.slice(equalSignIndex + 1);

      cookies[key] = value;
    });
  }

  return cookies;
};

export default Req;
