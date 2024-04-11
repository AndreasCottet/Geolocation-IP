import express from 'express';
import {initBDD, IP} from './bdd.js';
import axios from 'axios';

const API_URL = 'http://ip-api.com/json/'
const app = express();
app.use(express.json())
const port = 8080;

async function getIP(ip) {
    return await axios.get(API_URL + ip)
}

app.get('/', async (req, res) => {
    let ret = await getIP("147.210.204.186")
    res.send(ret.data)
})

app.delete('/address', async (req, res) => {
    IP.findOne({ where: { address: req.body.address } }).then(async (ip) => {
        if (ip) {
            await ip.destroy()
            res.send('IP supprimé')
        } else {
            res.send('IP non trouvé')
        }
    })
})

app.listen(port, async () => {
    console.log(`Application démarré sur le port : ${port}`)
    await initBDD()
})