import jwt from "jsonwebtoken";

const generateToken = async (user) => {
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_TOKEN, {
    expiresIn: "30D",
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

export default generateToken;
