const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shopez_super_secret_jwt_key_2026_internship_evaluation', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
