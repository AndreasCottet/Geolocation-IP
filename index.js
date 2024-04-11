import express from 'express';
import {initBDD, IP} from './bdd.js';
import axios from 'axios';

const API_URL = 'http://ip-api.com/json/'
const app = express();
app.use(express.json())
const port = 8080;

app.get('/address', async (req, res) => {
    let addressIP = req.params.address
    let address = await IP.findOne({ where: { address: addressIP } })
    res.send(address)
})

app.delete('/address', async (req, res) => {
    let addressIP = req.body.address
    let address = await IP.findOne({ where: { address: addressIP } })
    if (address) {
        await address.destroy()
        res.send('IP supprimé')
    } else {
        res.send('IP non trouvé')
    }
})

app.listen(port, async () => {
    console.log(`Application démarré sur le port : ${port}`)
    await initBDD()
})