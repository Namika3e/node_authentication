const JWT = require("jsonwebtoken");

const isStillAuthenticated = async (req, res) => {
  try {
    const cookie = req.cookies;
    const accessToken = cookie.accessToken;
    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;

    const decoded = JWT.verify(accessToken, secret);

    if (cookie && decoded) {
      return res.status(200).json({ message:"Coookie is present and token is valid", isAuthenticated: true });
    } else if (!cookie || !decoded) {
      return res.status(403).json({ message:"No cookie or token is invalid", isAuthenticated: false });
    }
  } catch (error) {
    return res.status(500).json({message:"Something went wrong"})
  }
};


