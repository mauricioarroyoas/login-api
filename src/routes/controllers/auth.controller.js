// src/controllers/auth.controller.js
exports.login = (req, res) => {
    const { email, password } = req.body;
  
    // TODO: Add validation, lookup, and password check
    if (email === 'admin@example.com' && password === 'secret') {
      return res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
    }
  
    return res.status(401).json({ message: 'Invalid credentials' });
  };
  