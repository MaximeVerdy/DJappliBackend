var app = require("../app")
var request = require("supertest")
// var mongoose = require('mongoose')

describe('test route /', function(){
  test('get ok', async (done) => {
    await request(app).get("/")
    .expect(200)
    .expect(/response ok/)

  done()
  });

  test('test get nok', async (done) => {
    await request(app).get("/")
    .expect(200)
    .expect(/response nok/)
  done()
  })
})
