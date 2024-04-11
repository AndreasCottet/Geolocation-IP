import express from 'express';
import { IP, initBDD } from './bdd.js';
import { getIP } from './apiIP.js';

const app = express();
app.use(express.json())
const port = 8080;


app.get('/', async (req, res) => {
    let ret = await getIP("147.210.204.186")
    res.send(ret.data)
})

app.post('/address', async (req, res) => {
    console.log(req.body.address)
    let ret = await getIP(req.body.address)
    res.send(ret.data)
    IP.create(ret.data)
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    await initBDD()
})