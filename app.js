const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();
const PORT = config.get('port') || 5000;
const URL = config.get('MongoUri');

app.use(express.json({ extended: true }));

app.use('/api', require('./routes/routs'));

async function start(todo) {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`PORT is ${PORT}...`));
    } catch (err) {
        console.log(err.stack);
    } finally {

    }
}
start();