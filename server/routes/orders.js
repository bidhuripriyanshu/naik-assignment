const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, checkPincodeApi } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/check-pincode', checkPincodeApi);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
