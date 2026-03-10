const express = require('express');
const { validateToken, admin } = require('../middilewares/authMiddileware');
const { getUsers, createUser, userID, deleteUser, login, checkUser, logout , updateUser } = require('../controllers/userController')

const userRoutes = require('express').Router()

userRoutes.get('/', validateToken, admin, getUsers);

userRoutes.post('/register', createUser);

userRoutes.get('/checkUser', validateToken, checkUser)

userRoutes.get('/:id', validateToken, userID)

userRoutes.post('/login', login);

userRoutes.post("/logout", validateToken , logout)

userRoutes.put('/:id', validateToken,  updateUser);

userRoutes.delete('/:id', validateToken, admin, deleteUser);

module.exports = userRoutes