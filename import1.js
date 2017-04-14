let FS = require("fs")
let MongoDB = require("mongodb")
let MongoClient = MongoDB.MongoClient
let {Parser} = require("newline-json")

let [dbName, scheme] = process.argv.slice(2)
let url = 'mongodb://localhost:27017/' + dbName

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err)
    process.exit(1)
  }
  console.log("Connection established to", url)

  ;(async() => {
    let collectionNames = JSON.parse(FS.readFileSync(scheme));
    await db.dropDatabase()

    for (let collectionName of collectionNames) {
      let collection = db.collection(collectionName)
      await collection.remove()
      await new Promise((resolve) => {
        let file = FS.createReadStream(collectionName + ".log", "utf-8")
        let parsed = file.pipe(new Parser())
        parsed.on("data", async (d) => {
          parsed.pause()
          await collection.insert(d)
          console.log(d)
          parsed.resume()
        })
        parsed.on("end", () => setTimeout(resolve, 1000))
      })
    }
  })().then(db.close.bind(db))
})