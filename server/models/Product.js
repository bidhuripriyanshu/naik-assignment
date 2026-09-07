const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },   // e.g. "100g", "250g"
  price: { type: Number, required: true },
  mrp: { type: Number },
  stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameMr: { type: String, default: '' },           // Marathi name
    slug: { type: String, unique: true, lowercase: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    descriptionMr: { type: String, default: '' },    // Marathi description
    image: { type: String, required: true },
    images: [{ type: String }],

    // High-impact: Weight variants
    variants: [variantSchema],

    // High-impact: Ingredients & nutrition
    ingredients: [{ type: String }],
    nutrition: {
      calories: String,
      protein: String,
      fat: String,
      carbs: String,
      sodium: String,
      servingSize: String,
    },

    // High-impact: Trust signals
    fssaiNumber: { type: String, default: '' },
    isOrganic: { type: Boolean, default: false },
    hasNoPreservatives: { type: Boolean, default: true },
    madeInIndia: { type: Boolean, default: true },

    // Usage suggestions
    usageSuggestions: [{ type: String }],

    // High-impact: Stock & ratings
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },

    // Reviews
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // Search tags
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
