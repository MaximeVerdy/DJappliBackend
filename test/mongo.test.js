const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
// const productService = require('../src/services/product');
const playlistModel = require('../bdd/SchemaPlaylistTitresProposes');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Top test suite.
 */
describe('playlist', () => {

    /**
     * Tests that a valid product can be created through the productService without throwing any errors.
     */
    it('can be created correctly', async () => {
        expect(async () => await productService.create(playlisttest))
            .not
            .toThrow();
    });
});

/**
 * Complete product example.
 */
const playlisttest = {
    titre: 'auteur - chanson test',
    votes: ['votestest'],
    user: 'utilisateur test'
};