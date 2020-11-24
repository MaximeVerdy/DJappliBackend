var app = require("../app")
var request = require("supertest")


describe('test route /', function (){
  test('test get ok', async(done) => {
    await request(app).get("/")
    .expect(200)
    .expect({title: 'Express'})
   done()
  })
  test('test get non ok', async(done) => {
    await request(app).get("/")
    .expect(200)
    .expect({title: 'Non Express'})
   done()
  })
  test('erreur page', async(done) => {
    await request(app).get("/efgerf")
    .expect(404)
   done()
  })
})