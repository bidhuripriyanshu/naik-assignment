const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantWeight: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    language: { type: String, enum: ['en', 'mr'], default: 'en' },

    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Cart stored in DB for abandoned cart recovery
    cart: [cartItemSchema],

    // Loyalty points
    loyaltyPoints: { type: Number, default: 0 },

    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
