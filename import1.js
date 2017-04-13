let FS = require("fs")
let {Readable} = require("stream")
let JSONStream = require('JSONStream')
let MongoDB = require("mongodb")
let MongoClient = MongoDB.MongoClient
let {Parser} = require("newline-json")

let scheme = "scheme.json"
let parser = new Parser()
let [dbName] = process.argv.slice(2)
let url = 'mongodb://localhost:27017/' + dbName

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err)
    process.exit(1)
  }

  console.log("Connection established to", url)

  ;(async() => {
    // TODO take collectionNames from scheme.json

    let collectionNames;
    await new Promise((resolve) => {
      let file = FS.createReadStream(scheme, {flags: 'r', encoding: 'utf-8'})
      file.pipe(parser).on("data", d => collectionNames = d)
      file.on("end", resolve)
    })

    await db.dropDatabase()
    for (let collectionName of collectionNames) {
      let collection = db.collection(collectionName)
      await collection.remove()
      await new Promise((resolve) => {
        let file = FS.createReadStream(collectionName + ".log", {flags: 'r', encoding: 'utf-8'})
        file.pipe(new Parser()).on("readable", async() => {
          console.log('readable')
          file.read()
          await sleep(4000);
        })
        file.on("data", async(d) => console.log(d))
        file.on("end", resolve)
      })
    }
  })().then(db.close.bind(db))
})