import express from 'express';

import { IP, initBDD } from './bdd.js';
import {getMultipleIP} from './apiIP.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import cors from 'cors';
import { isAddressWithListAddress} from "./check.js";

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
            title: 'Swagger Geolocation-IP',
            version: '1.0.0',
            description: 'Documentation de l\'API Geolocation-IP',
        },
    },
    apis: ['./index.js'], // Chemin vers vos fichiers de routes contenant les annotations Swagger
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /address:
 *   get:
 *     summary: Récupère toutes les adresses IP enregistrées.
 *     description: Permet de récupérer toutes les adresses IP et leurs informations enregistrées dans le système
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Les informations de toutes les adresse IP enregistrées.
 *       400:
 *         description: Une erreur s'est produit durant l'exécution de la requête
 */
app.get('/address', async (req, res) => {
    try {
        const addresses = await IP.findAll()
        res.status(200).json(addresses)
    } catch(e) {
        res.status(400).json("Erreur lors de la récupération des adresses IP, Message : " + e.message)
    }
})


/**
 * @swagger
 * /address/{addresses}:
 *   get:
 *     summary: Récupère les informations d'une liste d'adresses IP
 *     description: Permet de récupérer les informations d'une liste d'adresses IP si elles sont enregistrées dans le système.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: addresses
 *         description: Liste d'adresses IP séparées par des ;
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Les informations des adresses IP.
 *       400:
 *         description: Une erreur s'est produit durant l'exécution de la requête
 */
app.get('/address/:addresses', async (req, res) => {
    let addressesAsked = req.params.addresses?.split(";")

    if (!isAddressWithListAddress(addressesAsked)) {
        res.status(400).json('Adresse IP non valide')
        return
    }

    try {
        const resQuery = await IP.findAll({ where: { query: addressesAsked } })
        res.status(200).json(resQuery)
    } catch (e) {
        // A tester
        res.status(400).json("Erreur lors de la récupération des adresses IP, Message : " + e.message)
    }
})


/**
 * @swagger
 * /address:
 *   post:
 *     summary: Récupère et enregistre les informations d'un tableau d'adresses IP
 *     description: Permet de récupérer et d'enregister les informations d'un tableau d'adresses IP.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Un tableau d'adresses IP
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Address'
 *     responses:
 *       200:
 *         description: Les informations des adresses étaient déjà enregistrées.
 *       201:
 *         description: Les informations des adresses IP ont été enregistrées.
 *       400:
 *         description: Une erreur s'est produit durant l'exécution de la requête.
 */
app.post('/address', async (req, res) => {
    let addressesAsked = req.body.addresses

    if (!isAddressWithListAddress(addressesAsked)) {
        res.status(400).json('Adresse IP non valide')
        return
    }

    let resQuery = []
    try  {
        resQuery = await IP.findAll({ where: { query: addressesAsked } })

        if (addressesAsked.length === resQuery.length) {
            console.log("Toutes les adresses IP sont déjà enregistrées")
            res.status(200).json(resQuery)
            return
        }
        addressesAsked = addressesAsked.filter((el) => !resQuery.some((el2) => el2.query === el))

    } catch (e) {
        res.status(400).json("Erreur lors de la récupération des adresses IP depuis la base de données, Message : " + e.message)
        return
    }

    let IPList = resQuery
    try {
        const resApi = await getMultipleIP(addressesAsked)
        for (const address of resApi.data) {
            IPList.push(await IP.create(address))
        }
        res.status(201).json(IPList)
    } catch (e) {
        res.status(400).json("Erreur lors de la récupération et de la création des adresses IP, Message : " + e.message)
    }
})


/**
 * @swagger
 * /address:
 *   put:
 *     summary: Récupère et met à jour les informations d'un tableau d'adresses IP
 *     description: Permet de récupérer et de mettre à jour les informations d'un tableau d'adresses IP.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Un tableau d'adresses IP
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Address'
 *     responses:
 *       200:
 *         description: Les informations des adresses IP enregistrées.
 *       400:
 *         description: Une erreur s'est produit durant l'exécution de la requête.
 */
app.put('/address', async (req, res) => {
    const addressesAsked = req.body.addresses

    if (!isAddressWithListAddress(addressesAsked)) {
        res.status(400).json('Adresse IP non valide')
        return
    }

    try  {
        const resQuery = await IP.findAll({ where: { query: addressesAsked } })

        if(resQuery.length !== addressesAsked.length) {
            res.status(400).json("Toutes les adresses IP n'ont pas été trouvées")
            return
        }
        const resApi = await getMultipleIP(addressesAsked)

        for (const address of resQuery) {
            const addressApi = resApi.data.find((el) => el.query === address.query)
            if (addressApi) {
                address.update(addressApi)
            }
        }

        res.status(200).json(resQuery)
    } catch (e) {
        res.status(400).json("Erreur lors de l'exécution de la requête, Message : " + e.message)
    }
})

/**
 * @swagger
 * /address/{addresses}:
 *   delete:
 *     summary: Supprime une liste d'adresses IP  et leurs informations.
 *     description: Permet de supprimer une liste d'adresses IP ainsi que leurs informations de la base de données.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: addresses
 *         description: Liste d'adresses IP séparées par des ;
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Les informations des adresses IP ont bien été supprimées.
 *       400:
 *         description: Une erreur s'est produit durant l'exécution de la requête.
 */
app.delete('/address/:addresses', async (req, res) => {
    let addressesAsked = req.params.addresses?.split(";")

    if (!isAddressWithListAddress(addressesAsked)) {
        res.status(400).json('Adresse IP non valide')
        return
    }
    try {
        const resQuery = await IP.findAll({ where: { query: addressesAsked } })
        if (addressesAsked.length !== resQuery.length) {
            res.status(400).json("Toutes les adresses IP n'ont pas été trouvées")
            return
        }

        for (const address of resQuery) {
            await address.destroy()
        }
        res.status(200).json()
    } catch (e) {
        res.status(400).json("Erreur lors de la suppression des adresses IP, Message : " + e.message)
    }
})

/**
 * @swagger
 * definitions:
 *  Address:
 *    type: object
 *    properties:
 *      addresses:
 *        type: array
 *        default: ["147.210.204.185", "147.210.204.187", "147.210.204.186"]
 */
