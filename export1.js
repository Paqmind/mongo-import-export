let FS = require("fs")
let MongoDB = require("mongodb")
let MongoClient = MongoDB.MongoClient
let {Stringifier} = require("newline-json")

let [dbName, scheme] = process.argv.slice(2)
let url = "mongodb://localhost:27017/" + dbName

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err)
    process.exit(1)
  }
  console.log("Connection established to", url)

  ;(async() => {
    let collectionNames = (await db.listCollections().toArray()).map(x => x.name)
    let file = FS.createWriteStream(scheme)
    await file.write(JSON.stringify(collectionNames));
    for (let collectionName of collectionNames) {
      let collection = db.collection(collectionName)
      await new Promise((resolve) => {
        let file = FS.createWriteStream(collectionName + ".log")
        file.on("finish", resolve)
        collection.find().pipe(new Stringifier()).pipe(file)
      })
    }
  })().then(db.close.bind(db))
})


