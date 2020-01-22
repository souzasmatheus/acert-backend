const router = require('express').Router();
const User = require('../models/user');
const verifyPermission = require('../middlewares/verifyPermission');

router.get('/history', verifyPermission, async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    if (user) {
      res.status(200).send({ history: user.history });
    } else {
      res.status(400).send({ message: 'User does not exist' });
    }
  } catch (err) {
    res.status(500).send({ message: 'There has been an error' });
  }
});

module.exports = router;
