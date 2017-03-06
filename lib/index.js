import express from 'express';

let app = express();

app.get('/health', (req, res) => {
    res.status(200).json({ hello: 'world' });
});

app.listen(5001, () => {
    console.log('Listening...');
});