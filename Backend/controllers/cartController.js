import Cart from '../models/Cart.js';

// Get cart for logged-in user
export const getCart = async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) return res.json({ items: [] });

  res.json(cart);
};

// Add or update item in cart
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const index = cart.items.findIndex(item => item.product.toString() === productId);
    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();
  res.json(cart);
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const originalLength = cart.items.length;

    // FIX: Support both populated and non-populated product field
    cart.items = cart.items.filter(item => {
      if (item.product && typeof item.product === 'object' && item.product._id) {
        return item.product._id.toString() !== productId;
      }
      return item.product.toString() !== productId;
    });

    if (cart.items.length === originalLength) {
      return res.status(404).json({ msg: 'Product not found in cart' });
    }

    await cart.save();
    return res.json({ msg: 'Item removed', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
// Clear cart
export const clearCart = async (req, res) => {
  const userId = req.user._id;
  await Cart.findOneAndDelete({ user: userId });
  res.json({ msg: 'Cart cleared' });
};

// ...existing code...
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // FIX: Support both populated and non-populated product field
    const cartItem = cart.items.find((item) => {
      if (item.product && typeof item.product === 'object' && item.product._id) {
        return item.product._id.toString() === productId.toString();
      }
      return item.product.toString() === productId.toString();
    });

    if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });

    cartItem.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart: cart.items });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

