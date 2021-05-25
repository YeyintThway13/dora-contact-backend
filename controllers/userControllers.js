import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateTokens from "../utilities/generateTokens.js";
import generateToken from "../utilities/generateTokens.js";

export const signinUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ name: req.body.name });

  if (!user) {
    res.status(404).send({ message: "Invalid Name or Password" });
  } else {
    const samePw = await bcrypt.compare(
      String(req.body.password),
      user.password
    );
    if (!samePw) {
      res.status(401).send({ message: "Invalid Name or Password" });
    } else {
      const token = await generateTokens(user);
      res.send({
        name: user.name,
        token,
      });
    }
  }
});

export const signupUser = expressAsyncHandler(async (req, res) => {
  const existedUser = await User.findOne({ name: req.body.name });

  if (existedUser) {
    res.status(500).send({ message: "Name has been used" });
    return;
  }

  if (String(req.body.password).length <= 6) {
    res.status(401).send({ message: "Password must be at least 7 characters" });
    return;
  }

  if (req.body.password !== req.body.password2) {
    res.status(401).send({ message: "Enter the same passwords" });
    return;
  }

  const password = await bcrypt.hash(String(req.body.password), 8);

  const user = new User({
    name: req.body.name,
    password,
  });
  const token = await generateToken(user);
  const createdUser = await user.save();
  res.send({
    _id: createdUser.id,
    name: createdUser.name,
    token,
  });
});

export const signoutUser = expressAsyncHandler(async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("User Logged Out");
  } catch (e) {
    res.status(500).send({ message: "Something wrong with logging outtttt" });
  }
});
