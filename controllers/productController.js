const Product = require('../models/productSchema')
const mongoose = require('mongoose');

const getProducts = async (req, res) => {
    try {

        const { category, minPrice, maxPrice, search, sort, page = 1, limit = 40 } = req.query;

        let filter = {};
        if (search) {

            filter.name = { $regex: search, $options: "i" }
        }

        // category filter

        if (category) {
            filter.category = category;
        }

        // price filter

        if (minPrice || maxPrice) {

            filter.price = {};


            if (minPrice) {

                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {

                filter.price.$lte = Number(maxPrice);
            }
        }

        let sortOption = {}
        if (sort === "price") sortOption.price = 1
        if (sort === "-price") sortOption.price = -1

        // Pagination
        const skip = (page - 1) * limit

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit))

        const total = await Product.countDocuments(filter)

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            products
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(id);
        if (!product) {


            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;
        const newProduct = new Product({ name, description, price, category, image, stock });
        await newProduct.save();
        res.status(201).json({ product: newProduct, message: 'Product created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body,
            {
                new: true,
                runValidators: true
            });

        if (!updatedProduct) {


            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product: updatedProduct, message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {

            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };