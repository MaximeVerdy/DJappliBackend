var app = require("../app")
var request = require("supertest")
var mongoose = require("mongoose")

var User = require("../bdd/SchemaHote")

beforeAll(async () => {
  const url = `mongodb+srv://admin/30094561@cluster0.xutoc.mongodb.net/EveryOneIsTheDJ?retryWrites=true&w=majority`
  await mongoose.connect(url, { useNewUrlParser: true })
})

test("timer", async (done) => {
  const res = await request(app).post("/sign-up")

  .send({
    "name": 'f',
    "email": 'f'
  })

    const user = await User.findOne({ email: 'f' })

    expect(user.name).toBeTruthy()
    expect(user.email).toBeTruthy()

  done()
  
  })