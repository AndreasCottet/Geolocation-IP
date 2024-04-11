import express from 'express';
import { IP, initBDD } from './bdd.js';
import { getIP } from './apiIP.js';

const app = express();
app.use(express.json())
const port = 8080;

app.get('/address', async (req, res) => {
    let addressIP = req.params.address
    let address = await IP.findOne({ where: { query: addressIP } })
    res.send(address)
})
app.post('/address', async (req, res) => {
    console.log(req.body.address)
    let ret = await getIP(req.body.address)
    res.send(ret.data)
    IP.create(ret.data)
})

app.delete('/address', async (req, res) => {
    let addressIP = req.body.address
    let address = await IP.findOne({ where: { query: addressIP } })
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