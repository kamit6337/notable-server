const allowedUrlList = [
  "https://notable-client.onrender.com",
  "https://www.notable-client.onrender.com",
  "notable-client.onrender.com",
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (allowedUrlList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
