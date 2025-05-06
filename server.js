const express = require('express');
const db = require('./database.js');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
    db.all('SELECT * FROM reviews', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Submit an order
app.post('/api/orders', async (req, res) => {
    const { name, address, phone, email, delivery, payment, items, total } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Некорректный адрес электронной почты.' });
    }

    // Validate phone format (+7 followed by 10 digits)
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Номер телефона должен начинаться с +7 и содержать 10 цифр.' });
    }

    // Store order in database
    const stmt = db.prepare(`
        INSERT INTO orders (name, address, phone, email, delivery, payment, items, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(name, address, phone, email, delivery, payment, JSON.stringify(items), total, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Send order to Telegram bot
        const telegramMessage = `Новый заказ!\nФИО: ${name}\nАдрес: ${address}\nТелефон: ${phone}\nEmail: ${email}\nДоставка: ${delivery}\nОплата: ${payment}\nТовары: ${items.map(i => `${i.name} (размер: ${i.size}) x${i.quantity}`).join(', ')}\nИтого: ${total} ₽`;
        fetch(`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: '<YOUR_CHAT_ID>',
                text: telegramMessage
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Ошибка отправки заказа в Telegram.' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Ошибка отправки заказа в Telegram: ' + error.message });
        });
    });
    stmt.finalize();
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});