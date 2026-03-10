const express = require('express')
const orderRouters = require('express').Router()
const {validateToken , admin} = require('../middilewares/authMiddileware')

const {createOrder , getMyOrders , getOrderById , updateOrderToPaid , updateOrderToDelivered } = require('../controllers/orderController')

router.post('/', validateToken, createOrder);

router.get('/myorders', validateToken, getMyOrders);

router.get('/:id', validateToken, getOrderById);

// Admin routes
router.get('/', validateToken, adminOnly, getAllOrders);
router.put('/:id/pay', validateToken, updateOrderToPaid);
router.put('/:id/deliver', validateToken, adminOnly, updateOrderToDelivered);

module.exports = orderRouters