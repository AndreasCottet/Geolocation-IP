import express from 'express';
import { initBDD } from './bdd.js';
import axios from 'axios';

const API_URL = 'http://ip-api.com/json/'
const app = express();
const port = 8080;

async function getIP(ip) {
    return await axios.get(API_URL + ip)
}

app.get('/', async (req, res) => {
    let ret = await getIP("147.210.204.186")
    res.send(ret.data)
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    await initBDD()
})