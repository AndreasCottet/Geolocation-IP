import express from 'express';
import { IP, initBDD } from './bdd.js';
import { getIP } from './apiIP.js';

const app = express();
app.use(express.json())
const port = 8080;

app.get('/address', async (req, res) => {
    let addressIP = req.query.address
    let address = await IP.findOne({ where: { query: addressIP } })
    res.status(200).send(address)
})
app.post('/address', async (req, res) => {
    if (await IP.findOne({ where: { query: req.body.address } })) {
        res.send('IP déjà enregistré')
        return
    }
    let ret = await getIP(req.body.address)
    IP.create(ret.data)
    res.status(201).send(ret.data)
})

app.put('/address', async (req, res) => {
    let addressIP = req.body.address
    let address = await IP.findOne({ where: { query: addressIP } })
    if (address) {
        let ret = await getIP(addressIP)
        address.update(ret.data)
        res.status(200).send(ret.data)
    } else {
        res.status(200).send('IP non trouvé')
    }
})

app.delete('/address', async (req, res) => {
    let addressIP = req.body.address
    let address = await IP.findOne({ where: { query: addressIP } })
    if (address) {
        await address.destroy()
        res.status(200).send('IP supprimé')
    } else {
        res.status(200).send('IP non trouvé')
    }
})

app.listen(port, async () => {
    console.log(`Application démarré sur le port : ${port}`)
    await initBDD()
})
