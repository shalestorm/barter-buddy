
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert DB logic here

    await db.users.insert({ username, password: hashedPassword });

    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
