const mongoose = require('mongoose');

const dbHandler = require('./db-handler');

const playlistModel = require('../bdd/SchemaPlaylistTitresProposes');

/**
 * Connexion à la mémoire de la base de données avant tout test
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Nettoyage de tout test avant de procéder à un test
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Fermeture de la base de donnée et du serveur
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Début du test
 */
describe('playlist', () => {

    /**
     * Vérification qu'une chanson peut être enregistrée en base de donnée sans erreur
     */
    it('peut être créé correctement', async () => {

        /**
         * Chanson exemple
         */
        var newTitre = new playlistModel({
            titre: 'auteur - chanson test',
            vote: ['votestest'],
            user: 'utilisateur test'
          })

        expect(async () => await newTitre.save())
            .not
            .toThrow();
    });
});

