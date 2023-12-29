const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

mongoose
  .connect(
    process.env.URI
  )
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => console.error(err));

// ----------------------------------------------------

const User = require("./src/models/user");
const Post = require("./src/models/post");

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registerd" });
    }

    const newUser = new User({ name, email, password });

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message: "Registration successful",
      message: "Please check your email for verification",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error register user" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transporter

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "toilavinh642002@gmail.com",
      pass: "ccuiueyeghvwicla",
    },
  });

  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following to verify your email http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("error sending email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email", error);
    res.status(500).json({ message: "Email verification failure" });
  }
});

const genarateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = genarateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (user.password != password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json(token);
    console.log(token);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json("errror");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in following a user" });
  }
});

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.status(200).json({ message: "unfollowed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "error unfollowing a user" });
  }
});

app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();
    res.status(200).json({ message: "Post saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
  }
});

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    if (!updatePost) {
      res.status(400).json({ message: "post not found" });
    }

    updatePost.user = post.user;
    console.log(updatePost);
    res.json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while liking" });
  }
});

app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    if (!updatePost) {
       return res.status(400).json({ message: "post not found" });
    }

    updatePost.user = post.user;
    console.log(updatePost);
    res.json(updatePost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "an error occurred while unliking" });
  }
});

app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "an error occurred while getting the posts" });
  }
});


app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({ message: "post not found" });

    }
    return res.status(200).json({user});
  } catch (error) {
    res
    .status(500)
    .json({ message: "an error occurred while getting the posts" });

  }
})
