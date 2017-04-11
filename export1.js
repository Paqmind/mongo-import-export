let FS = require("fs")
let MongoDB = require("mongodb")
let MongoClient = MongoDB.MongoClient
let {Readable} = require("stream")
let {Stringifier} = require("newline-json")
let stringifier = new Stringifier()
let [dbName] = process.argv.slice(2)
let url = "mongodb://localhost:27017/" + dbName

  ;
(async() => {
  try {
    var db = await MongoClient.connect(url)
  } catch (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err)
    process.exit(1)
  }

  console.log("Connection established to", url)

  ;(async() => {
    // TODO write scheme.json

    let collectionNames = (await db.listCollections().toArray()).map(x => x.name)
    for (let collectionName of collectionNames) {
      let collection = db.collection(collectionName)
      await new Promise((resolve) => {
        let file = FS.createWriteStream(collectionName + ".log")
        file.on("finish", resolve)
        collection.find().pipe(stringifier).pipe(file)
      })
    }
  })().then(db.close.bind(db))

})()


