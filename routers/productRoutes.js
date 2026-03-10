const express = require('express');
const productRoutes = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateToken, admin } = require('../middilewares/authMiddileware')
productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProductById);

// Admins only

productRoutes.post('/',validateToken , admin , createProduct);
productRoutes.put('/:id', validateToken, updateProduct);
productRoutes.delete('/:id', validateToken, admin, deleteProduct);

module.exports = productRoutes;