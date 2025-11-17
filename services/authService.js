const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  async register(name, email, password, role = 'user') {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = this.generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    return { user: { id: user._id, email: user.email, role: user.role }, token };
  }
}

module.exports = new AuthService();