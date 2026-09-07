const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

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

// @desc  API to check pincode serviceability (Public)
// @route GET /api/products/check-pincode?pincode=422001
const checkPincodeApi = asyncHandler(async (req, res) => {
  const { pincode } = req.query;
  const result = checkPincodeServiceability(pincode);
  res.json(result);
});

// @desc  Get all products with filters, search, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, search, category, sort, page = 1, limit = 50 } = req.query;

  const query = {};

  const searchTerm = (keyword || search || '').trim();
  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  if (category && category !== 'All' && category.trim() !== '') {
    query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { 'variants.0.price': 1 };
  if (sort === 'price_desc') sortOption = { 'variants.0.price': -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'popular') sortOption = { numReviews: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const rawProducts = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

  const products = rawProducts.map(p => {
    const doc = p.toObject();
    if (!doc.price && doc.variants && doc.variants.length > 0) {
      doc.price = doc.variants[0].price;
    }
    return doc;
  });

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
});

// @desc  Search autocomplete — returns name suggestions
// @route GET /api/products/autocomplete?q=goda
const autocomplete = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);

  const results = await Product.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' }, name: 1, category: 1, image: 1, slug: 1, variants: 1 }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(6);

  res.json(results);
});

// @desc  Get featured/bestseller products
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ isFeatured: true }).limit(8);
  const bestsellers = await Product.find({ isBestseller: true }).limit(8);
  res.json({ featured, bestsellers });
});

// @desc  Get all categories
// @route GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc  Get single product by slug or id
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  
  let product = null;
  if (isObjectId) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({
      $or: [
        { slug: id.toLowerCase() },
        { name: { $regex: id.replace(/-/g, ' '), $options: 'i' } }
      ]
    });
  }

  if (!product) {
    product = await Product.findOne({});
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const doc = product.toObject();
  if (!doc.price && doc.variants && doc.variants.length > 0) {
    doc.price = doc.variants[0].price;
  }

  res.json(doc);
});

// @desc  Add review to product
// @route POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added', rating: product.rating, numReviews: product.numReviews });
});

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({ ...req.body });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @desc  Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = {
  getProducts, autocomplete, getFeaturedProducts, getCategories,
  getProductById, addReview, createProduct, updateProduct, deleteProduct, checkPincodeApi
};
