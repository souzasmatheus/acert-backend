const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({ message: 'All fields must be fulfilled' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    const newUser = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(newUser.password, salt);

    newUser.password = hash;

    try {
      const savedUser = newUser.save();

      const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);

      res
        .header('auth-token', token)
        .status(200)
        .send({ message: 'User successfully saved' });
    } catch (err) {
      res.status(500).send({
        message: 'There has been an error registering a new user'
      });
    }
  } else {
    res.status(400).send({
      message: 'This user already exists'
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res
          .header('auth-token', token)
          .status(200)
          .send({ message: 'You are now logged in', user });
      } else {
        res.status(400).send({
          message: 'E-mail or password incorrect'
        });
      }
    } catch (err) {
      res.status(400).send({
        message: 'There has been an error with the authentication'
      });
    }
  } else {
    res.status(400).send({
      message: 'E-mail or password incorrect'
    });
  }
});

module.exports = router;
