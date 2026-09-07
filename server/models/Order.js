const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        variantWeight: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'upi'],
      default: 'cod',
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
    },
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    // High-impact: Order tracking stages
    status: {
      type: String,
      enum: ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    trackingHistory: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    estimatedDelivery: Date,
    loyaltyPointsEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
