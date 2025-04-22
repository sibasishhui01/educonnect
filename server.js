// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.firebasestorage.app",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626",
  measurementId: "G-5L09MFWZQ2"
};
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const usersFile = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Registration endpoint
app.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).send('All fields are required.');
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const exists = users.find(user => user.username === username || user.email === email);
  if (exists) {
    return res.status(409).send('Username or email already exists.');
  }

  users.push({ username, email, password, role });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send('Registration successful!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
