import { createSlice } from '@reduxjs/toolkit';

const FREE_DELIVERY_THRESHOLD = 999;
const SHIPPING_FEE = 60;

const defaultCartItems = [
  {
    id: 'corn-chakali',
    name: 'Corn Chakali',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780036501/medusa/1780036499281-IMG_3868.JPG.jpeg.jpg',
    variant: '100g',
    price: 50,
    countInStock: 60,
    qty: 2
  },
  {
    id: 'beetroot-chips',
    name: 'Beetroot Chips',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780038991/medusa/1780038989592-IMG_3870.JPG.jpeg.jpg',
    variant: '100g',
    price: 70,
    countInStock: 50,
    qty: 2
  },
  {
    id: 'kolambi-lonche',
    name: 'Prawns Pickle (Kolambi Lonche)',
    image: 'https://res.cloudinary.com/dskzfipt3/image/upload/v1780121990/medusa/1780121988900-pomelli_photoshoot_image_1_1_0529%20%287%29.png.jpg',
    variant: '250g',
    price: 280,
    countInStock: 25,
    qty: 1
  }
];

const stored = localStorage.getItem('naikCart');
const savedItems = stored ? JSON.parse(stored) : defaultCartItems;

const calcTotals = (items, discountPercent = 0, discountFlat = 0) => {
  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeDelivery = itemsPrice >= FREE_DELIVERY_THRESHOLD || items.length === 0;
  const shippingPrice = isFreeDelivery ? 0 : SHIPPING_FEE;
  
  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = Math.round((itemsPrice * discountPercent) / 100);
  } else if (discountFlat > 0) {
    discountAmount = discountFlat;
  }

  const taxPrice = Math.round((itemsPrice - discountAmount) * 0.05); // 5% GST
  const totalPrice = Math.max(0, itemsPrice - discountAmount + taxPrice + shippingPrice);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - itemsPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    isFreeDelivery,
    amountNeededForFreeDelivery
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedItems,
    couponCode: '',
    discountPercent: 0,
    discountFlat: 0,
    ...calcTotals(savedItems)
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, image, variant, price, countInStock, qty = 1 } = action.payload;
      const existing = state.items.find(i => i.id === id && i.variant === variant);
      
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ id, name, image, variant, price, countInStock, qty });
      }

      Object.assign(state, calcTotals(state.items, state.discountPercent, state.discountFlat));
      localStorage.setItem('naikCart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const { id, variant } = action.payload;
      state.items = state.items.filter(i => !(i.id === id && i.variant === variant));
      Object.assign(state, calcTotals(state.items, state.discountPercent, state.discountFlat));
      localStorage.setItem('naikCart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { id, variant, qty } = action.payload;
      const item = state.items.find(i => i.id === id && i.variant === variant);
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(i => !(i.id === id && i.variant === variant));
        } else {
          item.qty = qty;
        }
      }
      Object.assign(state, calcTotals(state.items, state.discountPercent, state.discountFlat));
      localStorage.setItem('naikCart', JSON.stringify(state.items));
    },

    applyCoupon: (state, action) => {
      const { code, discountPercent = 0, discountFlat = 0 } = action.payload;
      state.couponCode = code;
      state.discountPercent = discountPercent;
      state.discountFlat = discountFlat;
      Object.assign(state, calcTotals(state.items, discountPercent, discountFlat));
    },

    clearCart: (state) => {
      state.items = [];
      state.couponCode = '';
      state.discountPercent = 0;
      state.discountFlat = 0;
      Object.assign(state, calcTotals([]));
      localStorage.removeItem('naikCart');
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, applyCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
