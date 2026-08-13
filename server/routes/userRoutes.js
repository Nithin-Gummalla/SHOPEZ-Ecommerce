const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
