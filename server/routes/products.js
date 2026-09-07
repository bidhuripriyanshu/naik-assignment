const express = require('express');
const router = express.Router();
const {
  getProducts, autocomplete, getFeaturedProducts, getCategories,
  getProductById, addReview, createProduct, updateProduct, deleteProduct, checkPincodeApi
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/check-pincode', checkPincodeApi);
router.get('/autocomplete', autocomplete);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, addReview);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
