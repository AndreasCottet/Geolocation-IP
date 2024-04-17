import express from 'express';

import { IP, initBDD } from './bdd.js';
import {getIP, getMultipleIP} from './apiIP.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors())
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
 * /address/{address}:
 *   get:
 *     summary: Récupère les informations d'une adresse IP
 *     description: Permet d récupérer les informations d'une adresse IP si elle est enregistrée dans le système
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Une adresse IP
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Les informations de l'adresse IP passé en paramètre
 */
app.get('/address/:address', async (req, res) => {
    const addressesAsked = req.params.address?.split(";")
    const resQuery = await IP.findAll({ where: { query: addressesAsked } })
    res.status(200).send(resQuery)
})

/**
 * @swagger
 * /address:
 *   get:
 *     summary: Récupère toutes les adresses IP enregistrées
 *     description: Permet d récupérer toutes les adresses IP et leurs informations enregistrées dans le système
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Une adresse IP
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Les informations de l'adresse IP passé en paramètre
 */
app.get('/address', async (req, res) => {
    const addresses = await IP.findAll()
    res.status(200).send(addresses)
})

// app.get('/addressa', async (req, res) => {
//     const addressesAddressAsked = req.body.address
//     const addressesAddress = await getMultipleIP(addressesAddressAsked)
//     // console.log(addressesAddress)
//     res.status(200).send()
// })


app.post('/address', async (req, res) => {
    const addressesAsked = req.body.address
    const resQuery = await IP.findAll({ where: { query: addressesAsked } })
    if (addressesAsked.length === resQuery.length) {
        res.status(200).send('IP déjà enregistrée')
        return
    }

    res.status(201).send()
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
 * /address/{address}:
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
app.delete('/address/:address', async (req, res) => {
    const addressesAsked = req.params.address?.split(";")
    const resQuery = await IP.findAll({ where: { query: addressesAsked } })
    for (const address of resQuery) {
        await address.destroy()
    }
})
