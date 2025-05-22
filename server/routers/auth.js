const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;


router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // we need to insert db logic here


    await db.users.insert({ username, password: hashedPassword });

    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.users.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
