// routes/index.js

const express = require('express');
const router = express.Router();
const { findUserById, updateUser } = require('../bace/DataBace');

// Маршрут для перегляду сторінки профілю
router.get('/profile', async function(req, res) {
    try {
        const user = await findUserById(req.user.id); // Запит до бази даних для отримання даних користувача
        res.render('profile', { user }); // Передача отриманих даних у шаблон профілю
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршрут для перегляду форми редагування профілю
router.get('/profile/edit', async function(req, res) {
    try {
        const user = await findUserById(req.user.id); // Запит до бази даних для отримання даних користувача
        res.render('profile-edit', { user }); // Передача отриманих даних у шаблон форми редагування профілю
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршрут для обробки форми редагування профілю
router.post('/profile/update', async function(req, res) {
    try {
        const { firstName, lastName, email } = req.body;
        await updateUser(req.user.id, firstName, lastName, email);
        res.redirect('/profile'); // Перенаправлення на сторінку профілю після оновлення
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
