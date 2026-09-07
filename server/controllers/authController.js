const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc  Register user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
    loyaltyPoints: user.loyaltyPoints, token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
      loyaltyPoints: user.loyaltyPoints, language: user.language,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); throw new Error('Invalid email or password');
  }
});

// @desc  Get profile
// @route GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name image slug variants');
  res.json(user);
});

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.language = req.body.language || user.language;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, language: updated.language, token: generateToken(updated._id) });
  } else {
    res.status(404); throw new Error('User not found');
  }
});

// @desc  Toggle wishlist
// @route POST /api/auth/wishlist/:productId
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.indexOf(productId);
  if (idx === -1) { user.wishlist.push(productId); }
  else { user.wishlist.splice(idx, 1); }
  await user.save();
  res.json({ wishlist: user.wishlist });
});

module.exports = { register, login, getProfile, updateProfile, toggleWishlist };
