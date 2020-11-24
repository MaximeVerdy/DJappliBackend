var app = require("../app");
var request = require("supertest");
var mongoose = require("../bdd/connexion");
const hote = require("../bdd/SchemaHote");

test("name", async (done) => {
await request(app).post("/addFirstName")
  .send({ "firstname": "John" })
  .expect(200)
  .expect({ prenom: "John" })

done()
})