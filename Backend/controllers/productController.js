import Product from '../models/Product.js';

// 📦 Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock, images } = req.body;

    // 🛡️ Basic validation
    if (!name || !price || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Name, price, and at least one image are required.' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      countInStock,
      images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🛒 Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        countInStock,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
