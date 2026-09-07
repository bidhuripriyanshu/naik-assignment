const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

const FREE_DELIVERY_THRESHOLD = 999;
const SHIPPING_COST = 60;
const POINTS_PER_RUPEE = 0.1;

const SERVICEABLE_REGIONS = {
  Pune: [/^(411|412)\d{3}$/],
  Vidarbha: [/^(440|441|442|443|444|445)\d{3}$/],
  Konkan: [/^(400|401|402|415|416)\d{3}$/],
  Nashik: [/^(422|423)\d{3}$/]
};

const checkPincodeServiceability = (pincodeStr) => {
  const pin = String(pincodeStr || '').trim();
  if (!/^\d{6}$/.test(pin)) {
    return { isServiceable: false, region: null, message: 'Please enter a valid 6-digit Pincode' };
  }

  for (const [region, regexes] of Object.entries(SERVICEABLE_REGIONS)) {
    if (regexes.some(r => r.test(pin))) {
      return {
        isServiceable: true,
        region,
        message: `⚡ Express Delivery available for ${pin} (${region} Region)!`
      };
    }
  }

  return {
    isServiceable: false,
    region: null,
    message: `❌ Delivery restricted: Naik Foods serves only Pune, Vidarbha, Konkan, and Nashik regions.`
  };
};

// @desc  API to check pincode serviceability
// @route GET /api/orders/check-pincode?pincode=411038
const checkPincodeApi = asyncHandler(async (req, res) => {
  const { pincode } = req.query;
  const result = checkPincodeServiceability(pincode);
  res.json(result);
});

// @desc  Create order with regional pincode validation
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) { res.status(400); throw new Error('No order items'); }

  // Enforce regional pincode access in backend
  const pin = shippingAddress?.postalCode || shippingAddress?.pincode;
  const pincodeCheck = checkPincodeServiceability(pin);
  if (!pincodeCheck.isServiceable) {
    res.status(400);
    throw new Error(`Delivery unserviceable for pincode ${pin || ''}. Naik Foods delivers strictly to Pune, Vidarbha, Konkan, and Nashik regions.`);
  }

  const itemsPrice = items.reduce((acc, item) => acc + item.price * (item.quantity || item.qty || 1), 0);
  const shippingPrice = itemsPrice >= FREE_DELIVERY_THRESHOLD ? 0 : SHIPPING_COST;
  const totalPrice = itemsPrice + shippingPrice;
  const loyaltyPointsEarned = Math.floor(totalPrice * POINTS_PER_RUPEE);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    loyaltyPointsEarned,
    estimatedDelivery,
    trackingHistory: [{ status: 'confirmed', message: `Order confirmed for ${pincodeCheck.region} region!` }],
  });

  // Award loyalty points
  await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: loyaltyPointsEarned } });

  res.status(201).json(order);
});

// @desc  Get my orders
// @route GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get order by ID with tracking
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json(order);
});

// @desc  Admin: update order status
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.status = status;
  order.trackingHistory.push({ status, message: message || `Order ${status}` });
  if (status === 'delivered') { order.isPaid = true; order.paidAt = new Date(); }
  await order.save();
  res.json(order);
});

// @desc  Admin: get all orders
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, checkPincodeApi };
