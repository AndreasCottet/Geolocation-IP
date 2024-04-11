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
            title: 'Ma super API de géolocalisation d\'adresse IP',
            version: '1.0.0',
            description: 'Documentation de ma super API',
        },
    },
    apis: ['./index.js'], // Chemin vers vos fichiers de routes contenant les annotations Swagger
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


/**
 * @swagger
 * /address:
 *   get:
 *     summary: Récupère les informations d'une adresse IP
 *     description: Envoie les informations d'une adresse IP passé en paramètre de la requête si elle est enregistrée
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Une adresse IP
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Les informations de l'adresse IP passé en paramètre
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

/**
 * @swagger
 * /address:
 *   delete:
 *     summary: Supprime les informations d'une adresse IP enregistrée
 *     description: Permet de supprimer les informations d'une addresse IP passé en paramètre
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Une adresse IP
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Informations de l'adresse IP supprimée
 */
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
