import express from 'express';
import { initBDD } from './bdd.js';

const app = express();
const port = 8080;
app.get('/', (req, res) => {
    res.send('Hello Word!')
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    await initBDD();
})