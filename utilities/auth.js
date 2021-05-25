import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ message: "Invalid Token" });
  }
};

export default auth;
