const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const API_KEY = require('./api-key');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('register', {});
});

app.post('/', async (req, res) => {
    const form = req.body;
    if (form.from === form.to) {
        res.render('index', {
            success: `${form.amount} ${form.from} worth ${form.amount} ${form.to}`,
        });
        return;
    }
    let timeout;
    try {
        timeout = setTimeout(() => {
            res.render('index', {
                error: 'Request timeout',
            });
        }, 5000);
        const { data } = await axios.get('https://forex.1forge.com/1.0.3/convert', {
            params: {
                from: form.from,
                to: form.to,
                quantity: parseInt(form.amount, 10),
                api_key: API_KEY,
            }
        });
        clearTimeout(timeout);
        res.render('index', {
            success: data.text,
        });
    } catch (e) {
        clearTimeout(timeout);
        res.render('index', {
            error: 'Unknown server error.',
        });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
