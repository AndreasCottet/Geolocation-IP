import express from 'express';

import { IP, initBDD } from './bdd.js';
import { getIP } from './apiIP.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(express.json())
const port = 8080;

app.listen(port, async () => {
    console.log(`Application démarré sur le port : ${port}`)
    await initBDD()
})

const options = {
    swaggerDefinition: {
        info: {
            title: 'Mon API',
            version: '1.0.0',
            description: 'Documentation de mon API',
        },
    },
    apis: ['./index.js'], // Chemin vers vos fichiers de routes contenant les annotations Swagger
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Renvoie un message de salutation
 *     description: Renvoie un message de salutation simple
 *     responses:
 *       200:
 *         description: Message de salutation renvoyé avec succès
 */
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
