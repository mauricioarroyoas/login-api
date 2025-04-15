const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

// Middleware to parse cookies and handle sessions
app.use(cookieParser());
app.use(express.json()); // Parse JSON request bodies
app.use(session({
  secret: 'your-secret-key', // A secret to sign the session ID
  resave: false,             // Don't save session if unmodified
  saveUninitialized: true,   // Save session even if uninitialized
  cookie: { httpOnly: true, maxAge: 3600000 } // Cookie settings (1 hour)
}));

// Example user data (you can store it in a database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(403).send('Not authorized');
  }
  next();
}

// Root route (home page)
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('we hit this endpoint');
  
  // Check if the user exists
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).send('Invalid credentials');

  // Store user in session
  req.session.user = user;

  res.send('Logged in successfully');
});

// Protected route (only accessible if authenticated)
app.get('/profile', isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.session.user.username}, you're authenticated`);
});

// Logout route (destroy the session)
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.send('Logged out successfully');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
